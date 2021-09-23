const express = require('express');
const app = express();
const PORT = 3000;

app.use(express.static('public'));
app.use(express.urlencoded({extended: true}));
app.use(express.json());

app.listen(PORT, () => {console.log('Listening on port', PORT)});

// POST route from client side containing DOM inputs
app.post('/createMessage', (req, res) => {
    const inputs = req.body.inputs;
    const guestId = Number(inputs.guestId);
    const companyId = Number(inputs.companyId);
    // if Number we'll want to use a default template, else use string custom entered template
    const template = Number(inputs.template) || inputs.template;
    const constructedMessage = new GreetingMessage(guestId, companyId, template).constructMessage();
    res.send(constructedMessage);
});

// ######  Comment out the above to run w/o server  ###### //

const companies = require('../Companies.json');
const guests = require('../Guests.json');
const greetingTemplates = require('../GreetingTemplates.json');

// Creates an over-arching class that defines guest and company info.  Usable as parent class to a variety message children classes.
class MessageDetails {
    constructor(guestId, companyId){
        this._guestId = guestId;
        this._companyId = companyId;
        this._guestInfo = guests.filter(guest => this._guestId === guest.id)[0];
        this._companyInfo = companies.filter(company => this._companyId === company.id)[0];
    }

    get guestInformation(){
        return this._guestInfo;
    }

    get companyInformation(){
        return this._companyInfo
    }
}

// Inputs are guest id, company id, and template - can be a template id or a string that is formatted in the same manner as a template
class GreetingMessage extends MessageDetails {
    constructor(guestId, companyId, template){
        super(guestId, companyId);
        this._template = template;
        // determine if id or manual string entry
        if (typeof this._template === 'number'){
        this._templateInfo = greetingTemplates.filter(t => this._template === t.id)[0];
        } else {
            this._templateInfo = {"message": template}
        }
    }

    get templateInformation(){
        return this._templateInfo
    }

    // method is used to determine which salutation should be used based on the time of day
    salutation = () => {
        const UTCNow = new Date();
        const companyTimezone = this._companyInfo.timezone
        let companyNow
        // Time is calculated in Daylight Savings Time.   Doesn't use local time, so message can be constructed remotely.
        // BUT, doesn't account for Standard Time (sorry Arizona) and only accurate in CONUS.
        // Default to 'Good day' for anything outside of CONUS specified timezone.
        switch (companyTimezone) {
            case "US/Pacific":
                companyNow = new Date(UTCNow-25200000)
                break;
            case "US/Mountain":
                companyNow = new Date(UTCNow-21600000)
                break;
            case "US/Central":
                companyNow = new Date(UTCNow-18000000)
                break;
            case "US/Eastern":
                companyNow = new Date(UTCNow-14400000)
                break;
            default:
                return "Good day"
        }

        // Only interested in the hour of day for the salutation
        const companyHour = companyNow.getUTCHours();
        // Determine salutation based on time of day
        if (companyHour >= 3 && companyHour < 12){
            return "Good morning"
        } else if (companyHour >= 12 && companyHour < 19){
            return "Good afternoon"
        } else if (companyHour >= 19 || companyHour < 3){
            return "Good evening"
        } else {
            return "Good day"
        }

    }

    // Used to assemble and construct the final message.
    constructMessage(){
        // messageVariable can be adjusted to contain any number of variable inputs
        const messageVariables = {
            "salutation": this.salutation(),
            "firstName": this._guestInfo.firstName,
            "lastName": this._guestInfo.lastName,
            "roomNumber": this._guestInfo.reservation.roomNumber,
            "company": this._companyInfo.company,
            "city": this._companyInfo.city,
        }
        // define the initial message template
        let message = this._templateInfo.message
        // loop through messageVariables, if the variable key is found in 'message', replace it with the variable value
        for (const key in messageVariables){
            message = message.replace(`{${key}}`, `${messageVariables[key]}`)
        }
        return message
    }
}



// Use the templates below to test w/o using server or GUI:
// const constructedMessage = new GreetingMessage(1, 1, 1).constructMessage();
// console.log(constructedMessage);
// const customConstructedMessage = new GreetingMessage(2, 3, "{salutation} {firstName} {lastName}. Room {roomNumber} is ready and waiting for you.  Please stop by the front desk when you arrive.").constructMessage();
// console.log(customConstructedMessage);
