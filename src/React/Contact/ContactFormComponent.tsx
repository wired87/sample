import React, {FormEvent, memo} from "react";
import {FormTypes} from "../screens/Contact";
import ContactSubmitButton from "./buttons/ContactSubmitButton";


interface ContactFormTypes {
  onSubmit: (e: FormEvent<HTMLFormElement>) => Promise<void>;
  handleChange: (event: React.ChangeEvent<HTMLSelectElement>) => void;
  form: FormTypes;
}


const ContactFormComponent: React.FC<ContactFormTypes> = (
  {
    onSubmit,
    handleChange,
    form
  }
) => {

  const buttonColor:{color: string} = {color: "rgb(255, 0, 0)"};

  return(
    <div className="container mt-5">
      <h2 className="mb-3">Contact</h2>
      <form onSubmit={onSubmit}>
        <div className="mb-3">
          <label className="form-label" htmlFor="first_name">
            First Name
          </label>
          <input className="form-control" type="text" id="first_name" required />
        </div>

        <div className="mb-3">
          <label className="form-label" htmlFor="last_name">
            Last Name
          </label>
          <input className="form-control" type="text" id="last_name" required />
        </div>

        <div className="mb-3">
          <label className="form-label" htmlFor="email">
            Email
          </label>
          <input className="form-control" type="email" id="email" required />
        </div>

        <div className="mb-3">
          <label className="form-label" htmlFor="options">
            What’s your concern?
          </label>
          <select value={form.option} id={"option"} className="form-control" onChange={handleChange}>
            <option value="security">Security</option>
            <option value="problem">Problem</option>
            <option value="questions">Questions</option>
            <option value="praise/criticism">Praise/Criticism</option>
            <option value="other">Other</option>
          </select>
        </div>

        <div className="mb-3">
          <label className="form-label" htmlFor="message">
            Message
          </label>
          <textarea className="form-control" id="message" required />
        </div>
        <div className="mb-3 flex-row flex align-items-center">
          <ContactSubmitButton />
          <div className={"alternative_mail_container"}>
            <p>
              Problems with Contact form? Send us your E-Mail directly:
              <span style={buttonColor}>&nbsp;info@sales-detective.live</span>
            </p>
          </div>
        </div>
      </form>
    </div>
  )
}

export default memo(ContactFormComponent);