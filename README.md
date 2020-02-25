# ALEXA-18 - Dynamic Entities Skill Template

The **Dynamic Entities Skill Template** demonstrates the use of [dynamic entities](https://developer.amazon.com/docs/custom-skills/use-dynamic-entities-for-customized-interactions.html) in a custom Alexa skill. Dynamic entities enable custom slot types to be updated at runtime. This avoids having to re-submit skills for certification to simply update custom slot values. 

## Example Use Case
Let's imagine we're building a skill for a coffee shop. The goal is to create a fun way to promote customer loyalty. So, we've come up with an idea for a skill that gives discounts to customers who can guess a secret word. 

**Here's how it works.**

Each day, the coffee shop posts a 'hint' that customers can use to guess the "secret word". Users guess the word using the Alexa skill. If the customer guesses correctly, the skill sends a discount code to the Alexa compainon app. The customer can then use the code to get the discount the next time they're in the coffee shop. 

## Happy Path
So, if the hint was: **A Sumatran wild-cat that cannot digest coffee beans**. This is what the dialog might be.

**USER** 
```
Alexa, open coffee words
```
**ALEXA** 
```
Welcome to coffee words. 
Guess this week's secret word and get a 20% discount. 
You can say: my guess is... and then a word. What's your guess?
```
**USER** 
```
My guess is a Luwak
```
**ALEXA**
```
You're correct! 
I sent a discount code to your Alexa app. 
Show the code before {date} and you'll get a 20% discount.
Thanks for playing!
```

## Implementing the Skill

To make our 'coffee words' skill work for our use case, we need a way to change the secret word(s) whenever there's a new hint. Since Alexa will have to recognize when users say the secret word, the word needs to be defined in a custom slot type. But changes to the interaction model normally require re-certification which isn't an option for this skill because the secret word will change frequently and certification could take too long. That's were dynamic entities come in.

Using dynamic entities, our skill can return the **Dynamic.UpdateDynamicEntities** directive that provides an **updateBehavior** value to either CLEAR or REPLACE values defined by a custom field type. So, we can effectivly change slot values and synonyms on the fly. In this template, we save the secret word(s) in a .json file but the values could be saved anywhere. The point is that you can change the word without rebuilding the model. 

### Setup Steps

To keep things simple the following setup steps are intnded for use with Alex-Hosted skills but of course you can also use this template with the ASK CLI.

#### 1. Login to the Alexa Developer console
- Login to [developer.amazon.com](https://developer.amazon.com)
- Navigate to the [Alexa Developer Console](https://developer.amazon.com/alexa/console/ask)

#### 2. Create an Alexa-Hosted skill
- Click the 'Create Skill' button
- Name the skill `coffee words`, choose the `Custom` model and `Alexa-Hosted (Node.js` then click the 'Create Skill' button again
- Choose the `Hello World Skill` template and click the 'Choose' button
#### 3. Setup the interaction model
- Create a slot type named `secretWordType` with the value 'dabble'
- Create custom intent named `SecretWordIntent` 
- Add a slot named `secretWord` to the `SecretWordIntent` intent
#### 4. Setup the skill code
- Copy the code from this template's [index.js](./lambda/custom/index.js) 
- Navigate to the skill's `code`
- Replace the code in `index.js` with the code from the template's index.js
#### 5. Testing
- Navigate to the `test` menu
- Test the skill with a known and unknown slot type
9. Update the dynamic slot values
10. Test the skill with the unknonwn slot type

## Things to Consider about Dynamic Entities

- Can only be used with custom slots
- Limited to 100 entities
- Static and Dynamic slot values can be used
- Dynamic.UpdateDynamicEntities directive must be called each time the skill is invoked 
- Can set the values for one or more slot type objects
- Be careful! The array is unordered. Sometimes the dynamic entity comes first and sometimes the static entity.
- Can't support one-shot utterances

### Resources

- https://developer.amazon.com/blogs/alexa/post/db4c0ed5-5a05-4037-a3a7-3fe5c29dcb65/use-dynamic-entities-to-create-personalized-voice-experiences
- https://developer.amazon.com/docs/custom-skills/use-dynamic-entities-for-customized-interactions.html

