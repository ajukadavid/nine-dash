// import emailjs from '@emailjs/browser';

// const templateParams = {
//     name: 'James',
//     notes: 'Check this out!',
//     recipient: 'silvahstix@gmail.com'
// };

// export const sendEmail = () => {
//     emailjs.send('service_6e36k6q','template_qx7fykb', templateParams, 'W5kexZDNe7KDfnQ7F')
// 	.then((response) => {
// 	   console.log('SUCCESS!', response.status, response.text);
// 	}, (err) => {
// 	   console.log('FAILED...', err);
// 	});
// }

import axios from 'axios'
  

export const makeRequest = async (email:string) => {
    const apiUrl = 'https://blog-api-zo90.onrender.com/registerMail';
    try {
      axios.post(apiUrl, {
        email
      })
      .then(function (response) {
        console.log(response);
      })
      .catch(function (error) {
        console.log(error);
      });
      } catch (error) {
        // Handle any errors
        console.error(error);
      }
}
