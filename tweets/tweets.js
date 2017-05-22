// BEFORE RUNNING:
// ---------------
// 1. If not already done, enable the Prediction API
//    and check the quota for your project at
//    https://console.developers.google.com/apis/api/prediction
// 2. This sample uses Application Default Credentials for authentication.
//    If not already done, install the gcloud CLI from
//    https://cloud.google.com/sdk and run
//    `gcloud beta auth application-default login`.
//    For more information, see
//    https://developers.google.com/identity/protocols/application-default-credentials
// 3. Install the Node.js client library by running
//    `npm install googleapis --save`

var google = require('googleapis');
var prediction = google.prediction('v1.6');

// string to string
function getSentimentLabel(sentimentTweet) {
  authorize(function(authClient) {
    var request = {
      project: 'angelic-bond-165518',
      id: 'sentiment-analysis',
      resource: {
        input: {
          csvInstance: [
            sentimentTweet
          ]
        }
      },
      auth: authClient
    };
    prediction.trainedmodels.predict(request, function(err, response) {
      if (err) {
        console.log(err);
        return;
      }
      // TODO: Change code below to process the `response` object:
      return response.outputLabel;
      //console.log(JSON.stringify(response, null, 2));
    });
  });
}

function authorize(callback) {
  google.auth.getApplicationDefault(function(err, authClient) {
    if (err) {
      console.log('authentication failed: ', err);
      return;
    }
    if (authClient.createScopedRequired && authClient.createScopedRequired()) {
      var scopes = ['https://www.googleapis.com/auth/cloud-platform'];
      authClient = authClient.createScoped(scopes);
    }
    callback(authClient);
});
}