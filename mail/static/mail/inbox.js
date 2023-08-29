document.addEventListener('DOMContentLoaded', function() {

  // Use buttons to toggle between views
  document.querySelector('#inbox').addEventListener('click', () => load_mailbox('inbox'));
  document.querySelector('#sent').addEventListener('click', () => load_mailbox('sent'));
  document.querySelector('#archived').addEventListener('click', () => load_mailbox('archive'));
  document.querySelector('#compose').addEventListener('click', compose_email);

  //Send email 
  document.querySelector('#compose-form').addEventListener('submit', send_mail)
  
  // By default, load the inbox
  load_mailbox('inbox');
});

function compose_email() {

  // Show compose view and hide other views
  document.querySelector('#emails-view').style.display = 'none';
  document.querySelector('#each-email-view').style.display = 'none';
  document.querySelector('#compose-view').style.display = 'block';

  // Clear out composition fields
  document.querySelector('#compose-recipients').value = '';
  document.querySelector('#compose-subject').value = '';
  document.querySelector('#compose-body').value = '';
}

function load_mailbox(mailbox) {
  
  // Show the mailbox and hide other views
  document.querySelector('#emails-view').style.display = 'block';
  document.querySelector('#compose-view').style.display = 'none';
  document.querySelector('#each-email-view').style.display = 'none';

  // Show the mailbox name
  
  document.querySelector('#emails-view').innerHTML = `<h3>${mailbox.charAt(0).toUpperCase() + mailbox.slice(1)}</h3>`;
  fetch(`/emails/${mailbox}`)
  .then(response => response.json())
  .then(emails=>{
    //Print emails
    console.log(emails);
    
    // for each email from the sent box a div is created that stores the data of each email
    emails.forEach((email) => {
      // creates a new div element that will hold the email
      const element = document.createElement('div');
      // assigns a color for the div if the mail is read or not
      if (email.read === true){
        element.classList.add('read');
        element.classList.remove('not_read');
      } else{
        element.classList.add('not_read');
        element.classList.remove('read');

      }
      // adds a cass to the element
      element.classList.add('each_email');
      // adds the email values to the div
      element.innerHTML = `<h5>${email.sender}</h5> <p>${email.subject}</p> <p id="time_stamp">${email.timestamp}</p>`
      // displays a more detailed page of the email
      element.addEventListener('click', function(){
        see_each_mail(email.id)
      });
      // adds the email into the container
      document.querySelector('#emails-view').append(element);
    });
    
  })
  
}

function send_mail(event){
  event.preventDefault();

  // Assins the form fields to variables
  const recipient = document.querySelector('#compose-recipients').value;
  const subject = document.querySelector('#compose-subject').value;
  const body = document.querySelector('#compose-body').value;

  // Send the data to the backend
  fetch('/emails', {
    method: 'POST',
    body: JSON.stringify({
      recipients: recipient,
      subject: subject,
      body: body
    })
  })
  .then(response => response.json())
  .then(result => {
    // Print result
    console.log(result);
    load_mailbox('sent');
    display_email('sent');
  })

}


function see_each_mail(email_id){

  // gets the email info into json from the API by its ID
  console.log(`/email/${email_id}`)
  fetch(`/emails/${email_id}`)
  .then(response => response.json())
  .then(email => {
    // show the mailbox and hide other views
    document.querySelector('#emails-view').style.display = 'none';
    document.querySelector('#compose-view').style.display = 'none';
    document.querySelector('#each-email-view').style.display = 'block';

    document.querySelector("#mail_from").innerHTML = email.sender;
    document.querySelector("#mail_to").innerHTML = email.recipents;
    document.querySelector("#mail_subject").innerHTML = email.subject;
    document.querySelector("#mail_timestamp").innerHTML = email.timestamp;
    document.querySelector("#mail_content").innerHTML = email.body;

    // when achived button is pressed achive the mail
    document.querySelector("#archive_btn").addEventListener('click', function(){

      // if a mail in unread gets the email by id and change it's status to achived
      if(!email.archived){
        fetch(`/emails/${email.id}`, {
          method: 'PUT',
          body: JSON.stringify({
              archived: true
          })
        })
      }
    });

    // if a mail in unread gets the email by id and change it's status to read
    if(!email.read){
      fetch(`emails/${email.id}`,{
        method: 'PUT',
        body: JSON.stringify({
          read:true
        })
      })
    }
  })


}



