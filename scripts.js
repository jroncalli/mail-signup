//jshint esversion: 6
const mailchimp = require('@mailchimp/mailchimp_marketing');
const express = require('express');
const bodyParser = require('body-parser');
const https = require('https');
const app = express();

const listId = '0f991c4f80';

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('public'));

app.get('/', function (req, res) {
  res.sendFile(__dirname + '/signup.html');
});

app.post('/', function (req, res) {
  let firstName = req.body.fName;
  let lastName = req.body.lName;
  let email = req.body.email;
  console.log(firstName, lastName, email);

  const newSubscriber = {
    firstName: firstName,
    lastName: lastName,
    email: email,
  };

  mailchimp.setConfig({
    apiKey: 'e4e92b5b435ff580818235a740d2ed2d',
    server: 'us18',
  });

  async function run() {
    const response = await mailchimp.lists
      .addListMember(listId, {
        email_address: newSubscriber.email,
        status: 'subscribed',
        merge_fields: {
          FNAME: newSubscriber.firstName,
          LNAME: newSubscriber.lastName,
        },
      })
      .then((response) => {
        if (response.id !== '') {
          res.sendFile(__dirname + '/success.html');
        }
      })
      .catch((err) => {
        res.sendFile(__dirname + '/failure.html');
        console.log(err);
      });
  }

  run();
});

app.post('/failure', function (req, res) {
  res.redirect('/');
});

app.listen(3000, function () {
  console.log('Server is listening on port 3000');
});
