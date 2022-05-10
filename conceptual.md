### Conceptual Exercise

Answer the following questions below:

- What is a JWT?
  - JSON Web Tokens (JWT) is an open standard used to share security information between two parties: a client and a server. JWTs are implemented across technology stacks, making it simple to share tokens across different services. JWT contains encoded JSON objects, including a set of claims. JWTs are signed using cryptographic algorithm to ensure that the claims cannot be altered after the token is issued. JWTs are similar to Flask's session. JWTs were created to change the way you authenticate your users. With JWTs, the information can be stored on the client's side. 

- What is the signature portion of the JWT?  What does it do?
  - JWTs can store any arbitrary "payload" of info, which are "signed" using a secret key, so they can be validated later (similar to Flask's session). The JWT token is a string comprising three parts:
    - **Header:** metadata about token *(signing algorithm used and type of token)*
    - **Payload:** data to be stored in token *(typically an object)*; often, this will store things like the 'user id' and this is encoded, not encrypted - DO NOT put secret info here!
    - **Signature:** version of header and payload, signed with secret key; it uses algorithm specified in the header

- If a JWT is intercepted, can the attacker see what's inside the payload?
  - Yes. The payload is only encoded and not encrypted, so such can be decoded without knowing the secret key used to sign the token. You do not put the secret info here due to the easy nature of it being decoded.

- How can you implement authentication with a JWT?  Describe how it works at a high level.
  - We can implement authentication with a JWT when a client successfully provides its identity via a login endpoint. User makes request with username/password to AJAX login route, and the server authenticates and returns token in JSON. From the front-end, JavaScript receives token and stores it. Now, for every future request, browser sends token in request and the server gets token from request and validates the token before responding to the client.

- Compare and contrast unit, integration and end-to-end tests.
  - Unit Test
    - Unit tests focuses on testing small units and should be tested in isolation and independent of other units. These tests should be fast, and usually shouldn't take more than a few seconds to provide feedback. This is performed prior to integration testing
  - Integration
    - Integration tests focuses on a small number of modules and test their interactions. They ensure that modules work well in isolation, but also play well together.
  - End-to-End
    - End-to-end testing verifies that your software works correctly from the beginning to the end of a particular user experience. It replicates expected user behavior and various usage scenarioes to ensure that your software works as a whole. 

- What is a mock? What are some things you would mock?
  - Mocking is primarily used in unit testing. Mocking means creating a fake version of an external or internal service that can stand in for the real one, helping your tests run more quickly and more reliably. When your implementation interacts with an object's properties, rather than its function or behavior, a mock can be used. This is useful if the real objects are impractical to incorporate into the unit test.

- What is continuous integration?
  - CI is the practice of merging in small code changes frequently, rather than merging in a large change at the end of a development cycle. The goal is to build better software by developing and testing in smaller increments.

- What is an environment variable and what are they used for?
  - An environment variable is a variable whose value is set outside the program, typically through functionality built into the operating system. It is made up of name/value-pair, and any number may be created and available for reference at a point in time. These variables are helpful because they allow you to change which of your environments use third-party service environment by changing an API key, endpoint, or whatever the service uses to distinguish between environments

- What is TDD? What are some benefits and drawbacks?
  - Test-Driven Development or TDD, reduces time spent on rework. You spend less time debugging and are able to identify the errors and problems quickly. Some of the drawbacks are that the tests can be difficult to write, due to the tests having to be maintained as code is refactored, thus, slowing down development and progress.

- What is the value of using JSONSchema for validation?
  - The primary strength of JSONSchema is that it generates clear, human- and machine-readable documentation, so validating with JSONSchema allows request data to fail quickly before invalid data comes into contact with your database. It also eliminates the need to write elaborate code to check for the incoming data and it's easier to set up and maintain

- What are some ways to decide which code to test?
  - For unit tests, find the smallest unit of testable code, that way you can prove that your code actually works. This will help detect bugs in the earlier stages, and this can make easier changes and simplified integrations. Doing so is more useful in the agile process. Testers don't get functional builds to test until integration is completed, so running unit tests can demonstrate code completeness.

- What are some differences between Web Sockets and HTTP?
  - Web Sockets are an event-driven protocol, which means you can use it for realtime communication. HTTP is stateless and requires making a request in order to get a response. The difference between the two is that with Web Sockets, updates are sent immediately when they are available, unlike HTTP.

- Did you prefer using Flask over Express? Why or why not (there is no right
  answer here --- we want to see how you think about technology)?
  - I liked both frameworks, honestly. But I do prefer Flask right now over Express because of the simple applications I'm currently building. Flask is easy to work with and will teach you the basics that you'll need to know for building web apps in any coding language. 