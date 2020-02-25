/* 
* Copyright (C) 2020 Dabble Lab - All Rights Reserved
* You may use, distribute and modify this code under the 
* terms and conditions defined in file 'LICENSE', which 
* is part of this source code package.
*
* For additional copyright information please
* visit : http://dabblelab.com/copyright
*/

const secretWords = [
    {
        "id": "1",
        "name": {
            "value": "Luwak",
            "synonyms": [
            ]
        }
    }
];

const Alexa = require('ask-sdk-core');

const LaunchRequestHandler = {
    canHandle(handlerInput) {
        return handlerInput.requestEnvelope.request.type === 'LaunchRequest';
    },
    handle(handlerInput) {

        console.log(JSON.stringify(secretWords));

        secretWords.forEach(word => {
            console.log('word: ', JSON.stringify(word));
            console.log(word.name.value);
        });

        const secretWordEntities = {
            type: "Dialog.UpdateDynamicEntities",
            updateBehavior: "REPLACE",
            types: [
                {
                    name: "secretWordType",
                    values: secretWords
                }
            ]
        };

        const speechText = "Welcome to coffee words. Guess this week's secret word and get a 20% discount. You can say: my guess is - and then a word.  What's your guess?";
        return handlerInput.responseBuilder
            .addDirective(secretWordEntities)
            .speak(speechText)
            .reprompt(speechText)
            .getResponse();
    }
};

const SecretWordIntentHandler = {
    canHandle(handlerInput) {
        return handlerInput.requestEnvelope.request.type === 'IntentRequest'
            && handlerInput.requestEnvelope.request.intent.name === 'SecretWordIntent';
    },
    handle(handlerInput) {

        const response = handlerInput.responseBuilder;

        const slotSDValue = getStaticAndDynamicSlotValuesFromSlot(handlerInput.requestEnvelope.request.intent.slots.secretWord);

        let result = `${slotSDValue.value} is not the secret word. Sorry.`;

        if (slotSDValue.dynamic.statusCode === 'ER_SUCCESS_MATCH') {
            result = `Congratulations. ${slotSDValue.value} is correct.  I sent your discount to your Alexa app. Show it anytime this week for a 20% discount.`;
            response.withSimpleCard(
                "20% Discount",
                `Congratulations! You guessed our secret word '${slotSDValue.value}'. \r\nShow this for a 20% discount anytime this week.`);
        }

        const speechText = `${result}.`;

        return response
            .speak(speechText)
            //.reprompt('add a reprompt if you want to keep the session open for the user to respond')
            .getResponse();
    }
};

const FallbackIntentHandler = {
    canHandle(handlerInput) {
        return handlerInput.requestEnvelope.request.type === 'IntentRequest'
            && handlerInput.requestEnvelope.request.intent.name === 'AMAZON.FallbackIntent';
    },
    handle(handlerInput) {
        const speechText = 'Sorry I didn\'t get that. To guess the secret word say something like. My guess is - and then a word.';

        return handlerInput.responseBuilder
            .speak(speechText)
            .reprompt(speechText)
            .getResponse();
    }
};

const HelpIntentHandler = {
    canHandle(handlerInput) {
        return handlerInput.requestEnvelope.request.type === 'IntentRequest'
            && handlerInput.requestEnvelope.request.intent.name === 'AMAZON.HelpIntent';
    },
    handle(handlerInput) {
        const speechText = 'You can try to guess our secret word by saying my guess is - and then a word. What is your guess?';

        return handlerInput.responseBuilder
            .speak(speechText)
            .reprompt(speechText)
            .getResponse();
    }
};

const CancelAndStopIntentHandler = {
    canHandle(handlerInput) {
        return handlerInput.requestEnvelope.request.type === 'IntentRequest'
            && (handlerInput.requestEnvelope.request.intent.name === 'AMAZON.CancelIntent'
                || handlerInput.requestEnvelope.request.intent.name === 'AMAZON.StopIntent');
    },
    handle(handlerInput) {
        const speechText = 'Goodbye!';
        return handlerInput.responseBuilder
            .speak(speechText)
            .getResponse();
    }
};

const SessionEndedRequestHandler = {
    canHandle(handlerInput) {
        return handlerInput.requestEnvelope.request.type === 'SessionEndedRequest';
    },
    handle(handlerInput) {
        // Any cleanup logic goes here.
        return handlerInput.responseBuilder.getResponse();
    }
};

const IntentReflectorHandler = {
    canHandle(handlerInput) {
        return handlerInput.requestEnvelope.request.type === 'IntentRequest';
    },
    handle(handlerInput) {
        const intentName = handlerInput.requestEnvelope.request.intent.name;
        const speechText = `The intent named: '${intentName}' doesn't have an intent handler. Try saying something else.`;

        return handlerInput.responseBuilder
            .speak(speechText)
            .reprompt('Try saying something else.')
            .getResponse();
    }
};

const ErrorHandler = {
    canHandle() {
        return true;
    },
    handle(handlerInput, error) {
        console.log(`~~~~ Error handled: ${error.message}`);
        const speechText = `Sorry, there was an error. The error message was: '${error.message}'`;

        return handlerInput.responseBuilder
            .speak(speechText)
            .reprompt(speechText)
            .getResponse();
    }
};

const getStaticAndDynamicSlotValues = function (slots) {
    const slotValues = {}
    for (let slot in slots) {
        slotValues[slot] = getStaticAndDynamicSlotValuesFromSlot(slots[slot]);
    }
    return slotValues;
}

const getStaticAndDynamicSlotValuesFromSlot = function (slot) {

    const result = {
        name: slot.name,
        value: slot.value
    };

    if (((slot.resolutions || {}).resolutionsPerAuthority || [])[0] || {}) {
        slot.resolutions.resolutionsPerAuthority.forEach((authority) => {
            const slotValue = {
                authority: authority.authority,
                statusCode: authority.status.code,
                synonym: slot.value || undefined,
                resolvedValues: slot.value
            };
            if (authority.values && authority.values.length > 0) {
                slotValue.resolvedValues = [];

                authority.values.forEach((value) => {
                    slotValue.resolvedValues.push(value);
                });

            }

            if (authority.authority.includes('amzn1.er-authority.echo-sdk.dynamic')) {
                result.dynamic = slotValue;
            } else {
                result.static = slotValue;
            }
        });
    }
    return result;
};

exports.handler = Alexa.SkillBuilders.custom()
    .addRequestHandlers(
        LaunchRequestHandler,
        SecretWordIntentHandler,
        HelpIntentHandler,
        CancelAndStopIntentHandler,
        SessionEndedRequestHandler,
        FallbackIntentHandler,
        IntentReflectorHandler
    )
    .addErrorHandlers(
        ErrorHandler)
    .lambda();