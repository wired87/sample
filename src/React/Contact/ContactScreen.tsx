import React, {memo, useCallback, useEffect, useState} from 'react'
import axios from "axios";
import ReactLoading from 'react-loading';

import "bootstrap/dist/css/bootstrap.css";
import "../../App.css"
import SuccessModal from "../components/modals/SuccessModal";
import ContactFormComponent from "../components/ContactForm";
import FailedModal from "../components/modals/FailedModal";

//
const errorCodes: number[] = [
  500,
  404,
  400,
];

export interface FormTypes {
  first_name: string | null;
  last_name: string | null;
  email: string | null;
  message: string | null;
  option: string;
  successUrl: string | null;
}

const ContactForm = () => {

  useEffect(() => {
    document.title = 'Contact the Detective';
  }, []);

  const [submit, setSubmit] = React.useState<boolean>(false);
  const [seconds, setSeconds] = React.useState<number>(3);
  const [status, setStatus] = React.useState<number>(0);

  const [form, setForm] = useState<FormTypes>( {
    first_name: null,
    last_name: null,
    email: null,
    message: null,
    option: 'choose option',
    successUrl: null
  })

  const countdown = {
    start: function() {
      const interval = setInterval(() => {
        setSeconds(prevSeconds => {
          if (prevSeconds <= 1) {
            clearInterval(interval);
            return 0;
          } else {
            return prevSeconds - 1;
          }
        });
      }, 1000);}
  }

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    console.log("Submit Button pressed...")
    e.preventDefault();
    setSubmit(true);

    const formElements = e.currentTarget.elements as HTMLFormControlsCollection;

    const first_name = formElements.namedItem('first_name') as HTMLInputElement;
    const last_name = formElements.namedItem('last_name') as HTMLInputElement;
    const email = formElements.namedItem('email') as HTMLInputElement;
    const option = formElements.namedItem('option') as HTMLInputElement;
    const message = formElements.namedItem('message') as HTMLInputElement;

    let conFom = {
      first_name: first_name.value,
      last_name: last_name.value,
      email: email.value,
      option: option.value,
      message: message.value,
    };

    try {
      const response = await axios.post("https://lesterwired.pythonanywhere.com/contact/", conFom);
      console.log("response:" + response);
      const successUrl = response.data.successUrl;
      setForm({...form, successUrl: successUrl});
      console.log("response.data.status:", response.data.status);
      setStatus(response.data.status);

    } catch (error:unknown) {
      if (error instanceof Error) {
        // todo better error handling
        console.log("Error occurred:",error);
      }
      console.log("Something unexpected happened:", error);
    }
  };

  useEffect(() => {
    if (submit) {
      countdown.start();
    }
  }, [submit, status, countdown]);

  const handleChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setForm({ ...form, option: event.target.value });
  };


  const ContactContent = useCallback(() => {
    if (submit) {
      if (seconds > 0){
        return(
          <div className="modal_loadingDiv">
            <ReactLoading type={"spin"} color={"rgb(0, 0, 255"} height={150} width={150} />
          </div>
        )
      } else if ( status === 201 || status === 200) {
        return <SuccessModal />

      } else if ( errorCodes.includes(status) ) {
        return <FailedModal />

      }
    }else {
      return(
        <ContactFormComponent
          onSubmit={onSubmit}
          handleChange={handleChange}
          form={form}
        />
      );
    }
  }, [status])



  return (
    <div className="container mt-5">
      {
        ContactContent()
      }
    </div>
  );
}

export default memo(ContactForm);
