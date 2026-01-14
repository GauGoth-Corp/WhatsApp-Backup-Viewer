//Copyright © 2021-2026 GauGoth Corp. All rights reserved

//############ FUNCTIONS ###############

/**
 * Checks if the parameter is in date format (--AMERICAN) (XX/XX/XX)
 * @param {string} date date to verify
 * @returns {boolean}
 */
function isDate (date){
  let dateElements = date.split("/");
  let lengthList = dateElements.length;
  //console.log(lengthList);

  if (lengthList == 3) {
    let isDaysInt = parseInt(dateElements[1]);
    let isMonthsInt = parseInt(dateElements[0]);
    let isYearsInt = parseInt(dateElements[2]);
    //console.log(isDaysInt,isMonthsInt,isYearsInt);

    if (isDaysInt && isMonthsInt && isYearsInt && 1 <= dateElements[1] <= 31 && 1 <= dateElements[0] <= 12 && 0 <= dateElements[2] <= 99) {
      return true;
    }
    else return false;
  }
  else return false;

}

/**
 * Transforme un lien en clair en lien html
 *  @param {string} link link to check
 *  @returns {string} html link
 */
function toLink(link) {
  //Partie adresse classique
  if (link.search("https://") === 0 || link.search("http://") === 0 || link.search("www.") === 0 || link.search("mailto:") === 0 || link.search("tel:") === 0) {
    //Add https:// if missing
    let prefix = "";
    if (link.search("www.") === 0) {
      prefix = "https://";
    }
    return `<a title=${link} href=${prefix}${link} target='_blank'>${link}</a>`
  }
  //Partie mail en clair
  if (link.split("@").length == 2 && link.split("@")[1].split(".").length == 2 && link.split("@")[1].split(".")[1] != "") { 
    return `<a title=${link} href=mailto:${link} target='_blank'>${link}</a>`
  }
  //partie tel en clair
  //if (parseInt(link) &&  < parseInt(link) <  )
  return null
}

/**
 * Loads a SVG file and returns its content as a string
 * @param {string} path path to the SVG file
 * @returns {Promise<string>} Promise resolving to the SVG content as a string
 */
function loadSVG(path) {
  return fetch(path)
    .then(response => {
      if (!response.ok) throw new Error('Erreur réseau : ' + response.status);
      console.log("Fetched icon SVG");
      return response.text();
    })
    .catch(error => {
      console.error('Error loading icon SVG:', error);
      return null;
    });
}


function scrollFunction() {
  const scrollTopBtn = document.getElementById("scrollToTopBtn");

    //Montre le bouton Top quand la vue est à plus de 600px du haut
    if (window.scrollY > 600 || document.documentElement.scrollTop > 600) {
        scrollTopBtn.style.display = "block";
    } else {
        scrollTopBtn.style.display = "none";
    }

    //Pour le bouton Bottom
    const scrollBottomBtn = document.getElementById("scrollToBottomBtn");
    //Montre le bouton Bottom quand la vue est à moins de 600px du bas
    if (document.documentElement.scrollHeight - window.scrollY - window.innerHeight > 600) {
        scrollBottomBtn.style.display = "block";
    } else {
        scrollBottomBtn.style.display = "none";
    }
}

//Appel de la fonction scrollFunction à chaque fois qu'on scroll
window.onscroll = function() {scrollFunction()};

// Remonte en haut en "smooth" 
function scrollToTop() {
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

function scrollToBottom() {
    window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' });
}

//################# CODE ##############
const newURL = new URL(window.location.href);
const chatName = newURL.searchParams.get("chat");

// Real path (real paths for test, in .gitignore)
// == For tests with real conversations, much more data, varied content, true situations... ==
let realPath = "";
if (newURL.searchParams.get("real") == "true") {
  //let Path_conversationTest = "conversations/Test/WhatsApp Chat with Test.txt";
  realPath = "real/";
}

//let Path_conversationTest = "conversations/Test/WhatsApp Chat with Test.txt";
const chatPath = "conversations/"+realPath+chatName+"/WhatsApp Chat with "+chatName+".txt";
//Affiche le bon titre de chat
document.getElementById("chat-title").innerHTML = chatName;
document.title= chatName+ " - Whatsapp Backup Viewer | GauGoth Corp.";

fetch(chatPath)
  .then(response => {
    if (!response.ok) throw new Error('Erreur réseau : ' + response.status);
    return response.text();
  })
  .then(txt => { // Le code à exécuter une fois que le txt source est récupéré
    //console.log(txt);
    let formatConv = txt;
    formatConv = formatConv.replaceAll("&", "&amp;");
    formatConv = formatConv.replaceAll("<", "&lt;");
    formatConv = formatConv.replaceAll(">", "&gt;");
    formatConv = formatConv.replaceAll("  ", "&nbsp;&nbsp;"); //Pour garder les espaces
    formatConv = formatConv.replaceAll("\t", "&nbsp;&nbsp;&nbsp;&nbsp;"); //Pour garder les tabulations
    formatConv = formatConv.replaceAll('"', "&quot;");
    formatConv = formatConv.replaceAll("'", "&#39;");
    formatConv = formatConv.replaceAll("\r\n", "\n");
    formatConv = formatConv.replaceAll("\r", "\n");
    listMessages = formatConv.split('\n');

    function RunAfterLoaded() {
      //Enlève le message "chat empty"
      document.getElementById("empty-chat").style.display = "none";

      const chatMessagesElement = document.getElementById("chat-messages");
      let messageHeader;
      let previousMessageDate;
      let messageDate = "00/00/0000";
      let messageDateDay; //On met les trois suivants pour remettre la date au format français (là au format américain)
      let messageDateMonth;
      let messageDateYear;
      let messageHour = "10:16";
      let messageContent;
      let specialMessageClass = "";
      let messageSender;
      let messageTxt;
      let messageDeleted;
      let mediaOmitted;
      let mediaNotFound;
      let sender = "sent";
      let messageModel;
      let previousMessage;
      let svgWarningIcon = `<img class="icon missing-media-icon" src="datas/warning-icon.svg" alt="Warning icon">`;
      let svgTrashIcon = `<img class="icon deleted-message-icon" src="datas/trash-icon.svg" alt="Trash icon">`;
      let msgEdited = "";
      let svgIcon = "";

      // Loads SVG icons source code so we can style them with CSS (e.g. change color with stroke="currentColor")
      const imgWarningFallback = `<img class="icon missing-media-icon" src="datas/warning-icon.svg" alt="Warning icon">`;
      const imgTrashFallback = `<img class="icon deleted-message-icon" src="datas/trash-icon.svg" alt="Trash icon">`;

      Promise.all([
        loadSVG("datas/warning-icon.svg"),
        loadSVG("datas/trash-icon.svg")
      ]).then(([warningContent, trashContent]) => {
        svgWarningIcon = warningContent || imgWarningFallback;
        svgTrashIcon = trashContent || imgTrashFallback;

        // Parcourt tous les messages
        listMessages.forEach(msg => {
        //console.log("HELLO MOTHER FUCKER");
        //console.log(Array.from(document.querySelectorAll(".chat-message")).at(-1).children[0].innerHTML);

        messageHeader = msg.split(" - ")[0];
        //console.log(messageHeader);
        messageContent = msg.split(" - ")[1];
        //console.log(messageContent);

        previousMessageDate = messageDate;

        //Vérifie si le "msg" commence par une date : si non, ça veut dire que c'est simplement un retour chariot dans un message
        messageDate = messageHeader.split(", ")[0];
        //console.log(messageDate);
        if (isDate(messageDate)) {
          let oneNumberDay, oneNumberMonth;
          //console.log("Début message");
          messageDateDay = messageDate.split("/")[1];
          if (parseInt(messageDateDay) < 10) { oneNumberDay = "0";} else { oneNumberDay = "";}
          messageDateMonth = messageDate.split("/")[0];
          if (parseInt(messageDateMonth) < 10) { oneNumberMonth = "0";} else { oneNumberMonth = "";}
          messageDateYear = messageDate.split("/")[2];
          messageDate = oneNumberDay+messageDateDay + "/" + oneNumberMonth+messageDateMonth + "/20" + messageDateYear;
          messageHour = messageHeader.split(", ")[1];
          //console.log(messageHour);          
        }
        else {
          //console.log("Insertion suite message précédent")
          //Si on a un retour à la ligne dans un message, on insère directement le txt dans le p du message (donc itération précédente)
          previousMessage = Array.from(document.querySelectorAll(".chat-message")).at(-1).children[0];

          previousMessage.insertAdjacentHTML('beforeend', "\n<br>\n"+msg);
          //Skip le reste des étapes
          return;
        }


        if (messageContent == "Messages and calls are end-to-end encrypted. Only people in this chat can read, listen to, or share them. Learn more.") {
          //console.log("Info");
          messageModel = 
`<div class="chat-info-message warning">
  <p>${messageContent}</p>
</div>\n`;
          messageDate = previousMessageDate; //Sinon skip la date pour le premier message (tjs après l'annonce "encrypted")
        }
        else if (messageContent == chatName+" is a contact") {
          messageModel = 
`<div class="chat-info-message">
  <p>${messageContent}</p>
</div>\n`;
          messageDate = previousMessageDate;          
        }
        else {

          //Affiche la date pour chaque nouveau jour
          if (messageDate != previousMessageDate) {
            messageModel = 
`<div class="chat-info-message">
  <p>${messageDate}</p>
</div>\n`;
          chatMessagesElement.insertAdjacentHTML('beforeend', messageModel);
          }

          messageSender = messageContent.split(": ")[0];
          //console.log(messageSender);
          messageTxt = messageContent.split(": ")[1];
          //console.log(messageContent);

          if(messageSender == chatName) sender = "received";
          else sender = "sent";
          //console.log(sender);
          
          //Checks if there is any link, then replace it by its href
          let messageElements = messageTxt.split(" ");
          //console.log(messageElements);
          messageTxt = "";
          //console.log("hello");
          for (let i=0; i < messageElements.length; i++) {
            //console.log("Ca tourne");
            if (toLink(messageElements[i])) {
              messageTxt = messageTxt+" "+toLink(messageElements[i]);
              //console.log("Link");
            }
            else {
              messageTxt = messageTxt + " "+messageElements[i];
              //console.log("Pas link");
            }
          }

          //Do not forget to re-initialize
          specialMessageClass = "";
          msgEdited = "";
          svgIcon = "";

          //<Media omitted>
          if (messageTxt == " &lt;Media omitted&gt;") {
            specialMessageClass += " missingContent";
            messageTxt = "This message was not exported during the backup";
            svgIcon = svgWarningIcon;
          
          }

          //<View once voice message omitted>
          if (messageTxt == " &lt;View once voice message omitted&gt;") {
            specialMessageClass += " messageDeleted";
            messageTxt = "View once message opened";
            svgIcon = svgWarningIcon;
          }

          //<Video note omitted>
          if (messageTxt == " &lt;Video note omitted&gt;") {
            specialMessageClass += " missingContent";
            messageTxt = "This video note was not exported during the backup";
            svgIcon = svgWarningIcon;
          
          }

          //This message was deleted
          if (messageTxt == " This message was deleted" || messageTxt == " You deleted this message") {
            specialMessageClass += " messageDeleted";
            messageTxt = "This message was deleted";
            svgIcon = svgTrashIcon;

          }

          //<This message was edited>
          if (messageTxt.endsWith(" &lt;This message was edited&gt;")) {
            messageTxt = messageTxt.replace(" &lt;This message was edited&gt;","");
            msgEdited = `<span class="edited-indicator">(edited)</span>`;
          }

          messageModel = 
`<div class="chat-message ${sender}${specialMessageClass}">
  <p>${svgIcon}${messageTxt}</p>
  <span class="message-footer">
    ${msgEdited}
    <span class="message-time">${messageHour}</span>
  </span>
</div>\n`;

        }
        chatMessagesElement.insertAdjacentHTML('beforeend', messageModel);
      });

      //Scrolls to bottom when loaded
      setTimeout(() => {
        window.scrollTo(0, document.body.scrollHeight);
        console.log("Scrolled to bottom. scrollHeight:", document.body.scrollHeight);
      }, 0);

      //Makes the scroll buttons appear/disappear on load
      scrollFunction();

      console.log("Chat loaded.");

      //chatMessagesElement.insertAdjacentHTML('afterbegin', "<p>" +formatConv +"</p>");

      //End of ".then(([warningContent, trashContent]) => {"
      });
    } //End of RunAfterLoaded()

    if (document.readyState === "loading") {//Attend la fin du chargement, si celui-ci est en cours
      document.addEventListener("DOMContentLoaded", () => {
        RunAfterLoaded();
      });
    } 
    else {
      RunAfterLoaded();
    }



  })
  //Si le JS n'a pas réussi à récupérer le fichier du header :
  .catch(erreur => {
    /* Attendre le chargement complet de la page : */
    document.addEventListener("DOMContentLoaded", function() {

        console.error('Error when loading the conversation source file:', erreur);
        let messageContent = "Network error. Please reload the page or try again later.";
         let messageModel = 
`<div class="chat-info-message error">
  <p>${messageContent}</p>
</div>\n`        
        document.getElementById('chat-messages').innerHTML = '<p>'+messageModel+'</p>';

    });
    
  });

