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


// export const makeRequest = async () => {
//     const apiUrl = 'https://us21.api.mailchimp.com/3.0/ping';
//     const authToken = '70dd6ed82bfac6c0e272fcd8470fa01d-us21';

//     try {
//         const response = await axios.get(apiUrl, {
//           headers: {
//             Authorization: `Bearer ${authToken}`,
//           },
//         });
    
//         // Handle the response data
//         console.log(response.data);
//       } catch (error) {
//         // Handle any errors
//         console.error(error);
//       }
// }
