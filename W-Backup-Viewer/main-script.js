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
    return `<a href=${link} target='_blank'>${link}</a>`
  }
  //Partie mail en clair
  if (link.split("@").length == 2 && link.split("@")[1].split(".").length == 2 && link.split("@")[1].split(".")[1] != "") { 
    return `<a href=mailto:${link} target='_blank'>${link}</a>`
  }
  //partie tel en clair
  //if (parseInt(link) &&  < parseInt(link) <  )
  return null
}




//################# CODE ##############
const newURL = new URL(window.location.href);
const chatName = newURL.searchParams.get("chat");

//let Path_conversationTest = "conversations/Test/WhatsApp Chat with Test.txt";
const chatPath = "conversations/"+chatName+"/WhatsApp Chat with "+chatName+".txt";

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
      let messageSender;
      let messageTxt;
      let messageDeleted;
      let mediaOmitted;
      let mediaNotFound;
      let sender = "sent";
      let messageModel;
      let previousMessage;

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

          if(messageSender == "Gautier") sender = "sent";
          else sender = "received";
          //console.log(sender);
          
          //Checks if there is any link, then replace it by its href
          let messageElements = messageTxt.split(" ");
          console.log(messageElements);
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

          messageModel = 
`<div class="chat-message ${sender}">
  <p>${messageTxt}</p>
  <span class="message-time">${messageHour}</span>
</div>\n`;
        }
        chatMessagesElement.insertAdjacentHTML('beforeend', messageModel);
      });
      //chatMessagesElement.insertAdjacentHTML('afterbegin', "<p>" +formatConv +"</p>");
    }

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

