// assuming this would be given somewhere
const CURRENT_USER = "Charlie Hemn";

window.onload = () => {
  fetchAPI("https://api.myjson.com/bins/18ce70", handleMessageJsonApiResponse);
};

// asynchronous cosumes a json api
const fetchAPI = (url, callback) => {
  fetch(url)
    .then(res => {
      // if status code isn't 200 throw error
      if (!res.ok) {
        throw Error(res.statusText);
      }
      return res.json();
    })
    .then(jsonBody => callback(jsonBody))
    // simple error handling
    .catch(err => console.log("ERROR", err));
};

const handleMessageJsonApiResponse = apiResponseObject => {
  // set conversation date
  const conversationDateSpanElement = document.getElementById(
    "conversation-date"
  );

  // puts date into a date object which has some cool functions for formatting
  const conversationDate = new Date(apiResponseObject.data.conversationDate);

  // fills html element with coversation date
  conversationDateSpanElement.innerHTML = conversationDate.toLocaleDateString(
    "en-us",
    { weekday: "long", month: "long", day: "numeric", year: "numeric" }
  );

  // sends each messsage off to be created in the DOM
  apiResponseObject.data.messages.map(message => createMessage(message));
};

// takes object containing all of the message data and adds the message to the page
const createMessage = messageObj => {
  // boolean used to see if this message is from the current user
  const isMessageFromCurrentUser =
    CURRENT_USER.toUpperCase() === messageObj.username.toUpperCase();

  // gets the container which contains the conversation
  const messageContainer = document.getElementById("message-container");

  // div that contains both the message and the photo
  const messageWrapperElement = document.createElement("div");
  messageWrapperElement.classList.add("message-wrapper");

  // puts photo on right if the message is sent from the current user
  if (isMessageFromCurrentUser) {
    messageWrapperElement.classList.add("current-user-message");
  }
  messageContainer.appendChild(messageWrapperElement);

  // div that contains the photo
  const photoDivElement = document.createElement("div");
  photoDivElement.classList.add("photo-div");
  messageWrapperElement.appendChild(photoDivElement);

  // photo of the person who sent the message
  photoDivElement.appendChild(createPhotoElement(messageObj.image, "user"));

  // message div which contains the message body and message footer
  const messageDivElement = document.createElement("div");
  messageDivElement.classList.add("message");
  if (messageObj.focused) {
    messageDivElement.classList.add("focused-message");
  }
  messageWrapperElement.appendChild(messageDivElement);

  // message body which contains the actual text of the message
  const messageBodyPElement = document.createElement("p");
  messageBodyPElement.innerHTML = messageObj.message;
  messageDivElement.appendChild(messageBodyPElement);

  // message footer
  const messageFooterDivElement = document.createElement("div");
  messageFooterDivElement.classList.add("message-footer");
  messageDivElement.appendChild(messageFooterDivElement);

  // adds username to message footer
  messageFooterDivElement.appendChild(
    createUsernameElement(messageObj.username, isMessageFromCurrentUser)
  );

  // adds clock to message footer
  messageFooterDivElement.appendChild(createClockElement());

  // adds time stamp to message footer
  messageFooterDivElement.appendChild(
    createTimeStampElement(messageObj.timestamp)
  );
};

// creates img element with the photo of the user
const createPhotoElement = (photoSRC, photoAlt) => {
  const messagePhotoImgElement = document.createElement("img");
  messagePhotoImgElement.alt = photoAlt;
  messagePhotoImgElement.src = photoSRC;
  messagePhotoImgElement.classList.add("user-photo");
  return messagePhotoImgElement;
};

// creates span with the user name
const createUsernameElement = (username, isMessageFromCurrentUser) => {
  const messageUserNameSpanElement = document.createElement("span");
  messageUserNameSpanElement.innerHTML = username;
  messageUserNameSpanElement.classList.add("username");
  // if this message belongs to the current user
  if (isMessageFromCurrentUser) {
    messageUserNameSpanElement.classList.add("current-user-username");
  }
  return messageUserNameSpanElement;
};

// creates span with html entity code for clock
const createClockElement = () => {
  const messageClockSpanElement = document.createElement("span");
  // clock does not represent the correct time it is just a good clock entity
  messageClockSpanElement.innerHTML = `&#128336;`;
  return messageClockSpanElement;
};

// creates span element with the time stamp for the message
const createTimeStampElement = incTimeStamp => {
  const messageTimeStampSpanElement = document.createElement("span");
  const cleanedTimeStamp = new Date(incTimeStamp).toLocaleString("en-US", {
    hour: "numeric",
    minute: "numeric",
    hour12: true
  });
  messageTimeStampSpanElement.innerHTML = cleanedTimeStamp;
  messageTimeStampSpanElement.classList.add("message-timestamp");
  return messageTimeStampSpanElement;
};
