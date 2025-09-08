// Logging Middleware/logger.js

const AUTH_TOKEN = "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJNYXBDbGFpbXMiOnsiYXVkIjoiaHR0cDovLzIwLjI0NC41Ni4xNDQvZXZhbHVhdGlvbi1zZXJ2aWNlIiwiZW1haWwiOiJiMjJlYzA3OEBraXRzdy5hYy5pbiIsImV4cCI6MTc1NzMxMTkwNSwiaWF0IjoxNzU3MzExMDA1LCJpc3MiOiJBZmZvcmQgTWVkaWNhbCBUZWNobm9sb2dpZXMgUHJpdmF0ZSBMaW1pdGVkIiwianRpIjoiNmEyZTRkZTgtMzE1Yy00NjRlLWI5NTMtMWRlN2YxMzE1NTk4IiwibG9jYWxlIjoiZW4tSU4iLCJuYW1lIjoic2FpIGFraWlsIiwic3ViIjoiZDc1NjI2NTAtM2RmNy00ZDNlLTlhZTYtMGU3YWY5YmQ3ZTA1In0sImVtYWlsIjoiYjIyZWMwNzhAa2l0c3cuYWMuaW4iLCJuYW1lIjoic2FpIGFraWlsIiwicm9sbE5vIjoiYjIyZWMwNzgiLCJhY2Nlc3NDb2RlIjoicXFRelprIiwiY2xpZW50SUQiOiJkNzU2MjY1MC0zZGY3LTRkM2UtOWFlNi0wZTdhZjliZDdlMDUiLCJjbGllbnRTZWNyZXQiOiJaWENXenBZTlpQRnJWQUVDIn0.J5JDdMRbso2sLGZXNRq6FxVfUgjeso8rGmZjgNJuI8E";
const API_URL = "http://20.244.56.144/evaluation-service/logs";

async function Log(stack, level, package, message) {
  try {
    const response = await fetch(API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': AUTH_TOKEN,
      },
      body: JSON.stringify({ stack, level, package, message }),
    });

    if (!response.ok) {
      console.error("Failed to send log:", response.status, await response.text());
      return;
    }
    
    const result = await response.json();
    console.log("Log sent successfully. LogID:", result.logID);

  } catch (error) {
    console.error("Error sending log:", error);
  }
}