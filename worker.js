let domain = ''; //your Zendesk subdomain
let auth = ''; //your base64 admin@domain.com/token:api_token

export default {
  async fetch(request, env) {
    const body = await request.json();
    const detail = body.detail

    //Check for agents
    if (detail.role == 'agent' || detail.role == 'admin'){
      var user_id = detail.id;
      //Set Signature for new users
      var update_result = await setSignature(user_id);
      if (update_result.error){
        return new Response(`${update_resulterror}: ${update_result.description}`,{status:404})
      }
      return new Response("Agent updated")
    }

    return new Response("No action was taken")

  }
}

async function setSignature(user_id){
  var user_data = {
    "user": {
      "alias": "Customer Care Agent",
      "signature": "{{agent.name}}\n{{agent.organization}}\n+1 (123) 456-7890",
      "details": "",
      "notes": "",
      "verified": true,
    }
  }

    let headers = {
      'Content-Type': 'application/json',
      'Authorization': 'Basic ' + auth
    }

    const init = {
      method: 'PUT',
      headers: headers,
      body: JSON.stringify(user_data)
    }

    const result = await fetch(`https://${domain}.zendesk.com/api/v2/users/${user_id}`, init)
    let json = await result.json();
    return json;
}
