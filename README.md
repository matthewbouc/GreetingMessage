# Greeting Message - Matt Bouc
    Create a program that takes a known guest and company, then a message template (pre-built or custom).
    Generate and output a message with specified variables populated.
    For Reference:
    Guest Ids are 1-6
    Company Ids are 1-5
    Template Ids are 1-4
    A custom message template can be entered but must follow variable formatting.
        Example:  {salutation} {firstName} {lastName}. Room {roomNumber} is ready and waiting for you. Please stop by the front desk when you arrive.
        Acceptable variables are: salutation, firstName, lastName, roomNumber, company, city.
    
## Instructions
- There are multiple ways to test and use this app.
- The app can be quickly spun up in Docker:
    - In your terminal, paste:   docker container run --publish 3000:3000 mgbouc/greeting-message
    - Visit localhost:3000 in a web browser.
    - Enter a guest id, company id, and template id (or a custom template) and click submit.

- Running locally:
    - Open GreetingMessage folder in an IDE like VSCode.
    - Node.js is required to run the program (download at nodejs.org)
    - To run with a GUI:
        - In the terminal, in GreetingMessage folder, type npm install.
        - Then, npm start
        - Visit localhost:3000 in a web browser
        - Enter a guest id, company id, and template id (or a custom template) and click submit.

    - To test the code in the code, without a GUI:
        - Comment the top lines of code in GreetingMessage/server/greeting.js
        - Uncomment the bottom lines of code in greeting.js
        - In your terminal, npm start


## Overview of Design Decisions / Language Choice

The project is on the server side using JS and node.js.  I imagine this to be a SaaS type program, so everything of importance should be server side.
I chose JS and node.js primarily because I've been using these extensively the last 6 months - the syntax is fresh in my mind.

Some major design decisions I made:
- Creating a parent class (MessageDetails).
    - I imagine there there would be multiple types of messages or letters or forms of communication that would benefit from solely knowing the guest and company.  This would allow the class to extend to many children class formats such as the GreetingMessage class.
- Using Ids for all inputs.
    - We want unique identifiers pulling the data, not random user inputs.  In the long run, the Id doesn't have to be seen, but it's what will be used to reference objects.
    - This also allows for an easy method of determining whether the template input is asking for a pre-built or custom format (number vs string)
- Date / Time and Salutation:
    - This is where I struggled the most with which direction I should go.  I realize this is a poor representation of time for mass implementation.  I'm sure there's a lot of external tools out there specifically for date/time, but my experience with them is low.  Again, imagining this as a SaaS type program, local time is not going to be reliable for a server, so I used the company time zone and new Date() UTC.  Unfortunately, this doesn't account for DST changes, so the program was built to be relevant for the majority of the year.
- constructMessage():
    - Variables are stored in the messageVariable object.  It's a convenient access point for the variables - looping through object allows all the variables to be checked against and inserted into the message template.
- Building out a GUI:
    - Initially this was planned to be a simple node.js, run using "node greeting.js".  Then I had the thought of getting this out on Docker. I'm trying to learn Docker and get some real deployment experience with it, and this seemed like the perfect sized project to use as my first personal image.  Having that experience of spinning up a container and being able to go straight to localhost:3000 then interact with the website just feels so smooth and fun to me, so that's what I wanted to present.

## Correctness / Testing
- Almost all my testing was done manually using console.logs.  Basically, verifying the objects I was getting and sending.  Same goes for verifying things like filter, replace, and new Date formatting were working as expected.  I tried to make objects and variables as intentional as possible to avoid excess information being passed where it wasn't needed.

## Future plans
- Date / Time: making sure this is responsive to specific locales and regions outside of CONUS would be great.
- Spending time thinking through or researching different message formats would be great.  The GreetingMessage class is very specific to the type of templates suggested in the requirements.
- There's a lot that could be done for user interface with how they select and input data; didn't feel like a priority, but it could affect backend code.