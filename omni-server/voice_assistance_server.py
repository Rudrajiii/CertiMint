from flask import Flask, request, jsonify
from flask_cors import CORS # type: ignore
import requests

app = Flask(__name__)
CORS(app)

OMNIDIMENSION_API_TOKEN = "y1RPJmb0D2wRB9qPp-PtViV2DkCEyGeDuFlOpbxmPAY"
AGENT_ID = 2499

def dispatch_omnidimension_call(to_number, customer_name=None, account_id=None):
    url = "https://backend.omnidim.io/api/v1/calls/dispatch"
    headers = {
        "Authorization": f"Bearer {OMNIDIMENSION_API_TOKEN}",
        "Content-Type": "application/json"
    }
    payload = {
        "agent_id": AGENT_ID,
        "to_number": to_number,
        "call_context": {
            "customer_name": customer_name,
            "account_id": account_id
        }
    }
    # Remove None values from call_context if not needed
    payload["call_context"] = {k: v for k, v in payload["call_context"].items() if v is not None}

    try:
        response = requests.post(url, headers=headers, json=payload)
        response.raise_for_status()
        print("Call dispatched successfully:", response.json())
        return {"success": True, "data": response.json()}
    except requests.exceptions.HTTPError as err:
        print(f"HTTP error occurred: {err}")
        print(f"Response: {response.text}")
        return {"success": False, "error": f"HTTP error: {err}"}
    except Exception as err:
        print(f"An error occurred: {err}")
        return {"success": False, "error": str(err)}

@app.route('/api/initiate-call', methods=['POST'])
def initiate_call():
    try:
        data = request.get_json()
        phone_number = data.get('phoneNumber')
        customer_name = data.get('customerName', 'Customer')
        
        if not phone_number:
            return jsonify({"success": False, "error": "Phone number is required"}), 400
        
        result = dispatch_omnidimension_call(phone_number, customer_name)
        
        if result["success"]:
            return jsonify({
                "success": True, 
                "message": "Call initiated successfully!",
                "data": result["data"]
            })
        else:
            return jsonify({
                "success": False, 
                "error": result["error"]
            }), 500
            
    except Exception as e:
        return jsonify({"success": False, "error": str(e)}), 500

if __name__ == '__main__':
    app.run(debug=True, port=5001)