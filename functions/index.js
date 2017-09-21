'use strict';

// The Cloud Functions for Firebase SDK to create Cloud Functions and setup triggers.
const functions = require('firebase-functions');
// The Firebase Admin SDK
require('firebase-admin');

// Google Actions SDK
const ActionsSdkApp = require('actions-on-google').ActionsSdkApp;

// The definition of the function we will be using for our conversation
exports.myCoolFunction = functions.https.onRequest((req, res) => {
    
    // get an instance of the Google Actions SDK
    const app = new ActionsSdkApp({request: req, response: res});

    // Function to handle our deep link intent
    function handleDeepLinkIntent (app) {
        tellMoreAboutProject(app);
    }
    
    function tellMoreAboutProject(app){
        // Use tell means we end the conversation
        app.tell('This project is a quick introduction to the Google Actions SDK. I hope you enjoyed it!');
    }

    // Function to handle the built in intents
    function handleBuiltInIntent (app) {
        // Get dialog state to know where we are in the conversation
        var dialogState = app.getDialogState();
        // get our custom parameter
        var stage = dialogState.stage;

        // Check where we are in the conversation
        if(stage === 1) {
            // we already greeted the user - we need to check their response
            // get the user's raw input
            let rawInput = app.getRawInput();
            if(rawInput === 'ok' || rawInput === 'yes' || rawInput === 'sure') {
                // user wants to know more
                tellMoreAboutProject(app);
            }else {
                // we finish the dialog
                app.tell('Ok then, goodbye!');
            }
        }else{
            // Build a prompt
            let inputPrompt = app.buildInputPrompt(false,
            'Welcome to My Cool Action! Are you interested to know more about this project?');
            // Update dialogState to keep track of the progress
            dialogState.stage = 1;
            // Use ask means we expect a response from the user
            app.ask(inputPrompt, dialogState);
        }
    }
    
    // Use a map to assign a function to an intent
    let actionMap = new Map();
    actionMap.set(app.StandardIntents.MAIN, handleBuiltInIntent);
    actionMap.set(app.StandardIntents.TEXT, handleBuiltInIntent);
    actionMap.set("MY_COOL_DEEPLINK_INTENT", handleDeepLinkIntent);
    app.handleRequest(actionMap);

  });