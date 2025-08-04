import os
import joblib
import pandas as pd
from flask import Flask, request, jsonify
from flask_cors import CORS

# Initialize the Flask app
app = Flask(__name__)

# --- FIX: Explicitly configure CORS ---
# This tells your backend to allow requests specifically from your live Vercel URL
# and your local development environment.
CORS(app, resources={r"/predict": {"origins": ["https://smart-diagnose.vercel.app", "http://localhost:5173"]}})


# --- LOAD ALL MODELS AT STARTUP ---
models = {}
model_columns = {}
model_path = '.' 

print("Loading all available models...")
try:
    for filename in os.listdir(model_path):
        if filename.endswith("_model.joblib"):
            model_name = filename.replace("_model.joblib", "")
            model_file_path = os.path.join(model_path, filename)
            columns_file_path = os.path.join(model_path, f"{model_name}_columns.joblib")
            
            if os.path.exists(columns_file_path):
                models[model_name] = joblib.load(model_file_path)
                model_columns[model_name] = joblib.load(columns_file_path)
                print(f"✅ Successfully loaded model: '{model_name}'")
            else:
                print(f"⚠️ Warning: Model file '{filename}' found but missing columns file '{model_name}_columns.joblib'.")

except Exception as e:
    print(f"❌ An error occurred during model loading: {e}")


# --- PREDICTION ROUTE ---
@app.route('/predict', methods=['POST'])
def predict():
    try:
        json_data = request.get_json()
        model_name = json_data.get('model_name')
        features = json_data.get('features')

        if not model_name or not features:
            return jsonify({'error': 'Missing model_name or features in the request.'}), 400

        if model_name not in models:
            return jsonify({'error': f"Model '{model_name}' is not available on the server."}), 404

        model = models[model_name]
        columns = model_columns[model_name]

        input_df = pd.DataFrame(features, index=[0])
        query_df = input_df.reindex(columns=columns, fill_value=0)
        
        prediction_raw = model.predict(query_df)
        result = int(prediction_raw[0])

        if hasattr(model, 'predict_proba'):
            probability = model.predict_proba(query_df)[0][1]
        else:
            probability = 0.95 

        return jsonify({'prediction': result, 'probability': probability})

    except Exception as e:
        print(f"❌ An error occurred during prediction: {e}")
        return jsonify({'error': 'An internal error occurred. Please check server logs.'}), 500

# This allows you to run the app directly
if __name__ == '__main__':
    app.run(debug=False, port=5001)
