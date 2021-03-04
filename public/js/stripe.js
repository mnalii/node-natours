import axios from 'axios';
import { showAlert } from './alerts';

export const bookTour = async (tourId) => {
  const stripe = Stripe(
    'pk_test_51IPfBoDc8Z247Ze7GB24udpMar9ndKezw2qsrLaK9wAVVb5Cntxq6vh8Pan73CqUkDq4tkxdj4OwM86PDLoyZPxx00EQmZI4TU'
  );
  try {
    // 1) Get checkout session from API
    const session = await axios(
      `http://localhost:3000/api/v1/bookings/checkout-session/${tourId}`
    );

    console.log(session);
    console.log(stripe);

    // 2) Create checkout form + charge credit card
    await stripe.redirectToCheckout({
      sessionId: session.data.session.id
    });
  } catch (error) {
    console.log(error);
    showAlert('error', error);
  }
};
