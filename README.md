Travis badge:

[![Build Status](https://travis-ci.org/slistrom/bth-js-front.svg?branch=main)](https://travis-ci.org/slistrom/bth-js-front)

Scrutinizer badge:

[![Scrutinizer Code Quality](https://scrutinizer-ci.com/g/slistrom/bth-js-front/badges/quality-score.png?b=main)](https://scrutinizer-ci.com/g/slistrom/bth-js-front/?branch=main)

## Description

This project is a frontend created for the project in the jsramverk course at BTH.

### Technical choices

This front.end is implemented using React and was bootstrapped with [Create React App](https://github.com/facebook/create-react-app). It is a front-end for a simple trading platform where users can register accounts and buy and sell stocks that have real-time simulated prices using webbsockets. I am using React-router to enable routing and URL linking. I am not using many other npm packages and most of the code is either native javascript or JSX to render the html pages. My two main reasons for using React is because I want to learn more about react and it is also the javascript framework that I know best at the moment. Most of the code is written as classes to keep state and I am using fetch to retrieve information in JSON from the backend API (and database).

For my stock charts I am using the npm package chart.js. I have not used charts before so the main reason I ended up using that package was thanks to recommendations by my fellow students. It was not to hard to use and seems like a reasonable easy way of both rendering static charts and charts updated with real-time information.

Due to time limitations in the project I am simulating the stock prices directly on the server and sending out messages to clients like this one. As I do not save the historical stock prices in the database the graphs will start from the latest current stockprice every time a user refresh the page.  

### Real-time microservice

For my real-time microservice I am using the npm package socket.io-client. My trading component is keeping track of the socket messages from the server as well as connecting and disconnecting to the server. I did not find it intuitive to integrate the socket code into React components, but that is probably just because I have not used it enough yet. In the end I think I managed to get a fairly decent implementation. 

The trading component is listening for emit messages from the server and every time a new message with new stock prices is received the trading component updated its state and also rerenders the page with the stock price charts. 

I find the socket a really cool technology (service) that enables many really useful services with real-time distribution of information between users. I belive this will be something that I definitely will be using more of in later projects. 

### Testing (Continious integration)

My testing is based locally on mocha and selenium testing. I initially used eslint to check my code quality but React does not generate very eslint friendly code so I gave up on that fairly quickly. I have however written Selenium tests that simulate a user during different usecases using the frontend. As the functionality of the front-end is very limited at this time and most of the functionality requires a backend it was hard to come up with useful and advanced test cases. That said I am currently testing the five following usecases:

1. Test index title
Here I test that the index page of the front-end has the correct title.

2. Test go to Trading
In this usecase I simulate a user that navigate to the trading page and that the page the user ends up on has the correct URL and heading.

3. Test go to Login
Similarly to the second test I here simulate a user going to the login page and verify that the page the user ends up on has the correct URL and header.

4. Test footer background color
In this test I verify that the footer of the front-end has the correct color.

5. Test go to register page via login page
In my final test I simulate a user that first navigate to the login page and then continues to navigate to the "register a new account" page and then I verify that the page the user ends up on has the correct URL and heading.

I am also using Travis and Scrutinizer to test the code quality and building my front-end based on my github repo. This required a little extra work as I had problems at first with the tests running before the front-end had started. I used the npm package start-server-and-test to make sure that the front-end server was started before the tests actually started.

## Available Scripts

In the project directory, you can run:

### `npm start`

Runs the app in the development mode.<br />
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

The page will reload if you make edits.<br />
You will also see any lint errors in the console.

### `npm run build`

Builds the app for production to the `build` folder.<br />
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.<br />
Your app is ready to be deployed!

See the section about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.

### `npm run eject`

**Note: this is a one-way operation. Once you `eject`, you can’t go back!**

If you aren’t satisfied with the build tool and configuration choices, you can `eject` at any time. This command will remove the single build dependency from your project.

Instead, it will copy all the configuration files and the transitive dependencies (webpack, Babel, ESLint, etc) right into your project so you have full control over them. All of the commands except `eject` will still work, but they will point to the copied scripts so you can tweak them. At this point you’re on your own.

You don’t have to ever use `eject`. The curated feature set is suitable for small and middle deployments, and you shouldn’t feel obligated to use this feature. However we understand that this tool wouldn’t be useful if you couldn’t customize it when you are ready for it.
