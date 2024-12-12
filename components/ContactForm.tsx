"use client";
import { useState } from "react";
import { useRouter } from "next/router";

const CONTACT_KEY =
  "Z-ymc97Dae8u4HHybHknc4DGRb51u6NnTOUaW-qG71ah1ZqsJfRcI6SaHg5APWutNcnMcaN3oZrZky-VQxBIyw";

export default function ContactForm({
  eventName,
  eventVersion,
  gtmEvent,
  button = "Send",
  redirectTo,
}: {
  eventName: string;
  eventVersion: string;
  gtmEvent: string;
  button?: string;
  redirectTo?: string;
}) {
  const router = useRouter();

  // Fields
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [survey, setSurvey] = useState("");
  const [disabled, setDisabled] = useState<boolean>(false);
  const [buttonCopy, setButtonCopy] = useState(button);

  const onSubmit = async (e) => {
    e.preventDefault();
    setDisabled(true);
    setButtonCopy("Sending...");
    let ref = "";
    try {
      const u = new URLSearchParams(window.location.search);
      if (u.get("ref")) {
        ref = u.get("ref") || "";
      }
    } catch (err) {
      // noop
    }
    try {
      await window.Inngest.event(
        {
          name: eventName,
          data: { email, name, message, survey, ref },
          user: { email, name },
          v: eventVersion,
        },
        { key: CONTACT_KEY }
      );
      // GTM
      window.dataLayer?.push({
        event: gtmEvent,
        ref,
        survey,
      });
      if (redirectTo) {
        setButtonCopy("Redirecting to scheduling...");
        const redirectURL = new URL(redirectTo);
        // Assume it's a Savvycal call URL
        redirectURL.searchParams.set("display_name", name);
        redirectURL.searchParams.set("email", email);
        router.push(redirectURL);
        console.log(redirectURL.toString());
        router.push(redirectTo);
      } else {
        setButtonCopy("Your message has been sent!");
      }
    } catch (e) {
      console.warn("Message not sent");
      setButtonCopy("Message not sent");
      setDisabled(false);
    }
  };

  return (
    <form
      onSubmit={onSubmit}
      className="p-4 sm:p-6 bg-surfaceSubtle flex flex-col items-start gap-4 rounded-lg border border-subtle"
    >
      <label className="w-full flex flex-col gap-2">
        <span>
          Your name <span className="text-warning">*</span>
        </span>
        <input
          type="text"
          name="name"
          onChange={(e) => setName(e.target.value)}
          required
          className="w-full p-3 bg-canvasBase border border-muted outline-none rounded-md"
        />
      </label>
      <label className="w-full flex flex-col gap-2">
        <span>
          Company email <span className="text-warning">*</span>
        </span>
        <input
          type="email"
          name="email"
          onChange={(e) => setEmail(e.target.value)}
          required
          className="w-full p-3 bg-canvasBase border border-muted outline-none rounded-md"
        />
      </label>
      <label className="w-full flex flex-col gap-2">
        <span>
          What can we help you with? <span className="text-warning">*</span>
        </span>
        <textarea
          name="message"
          required
          onChange={(e) => setMessage(e.target.value)}
          className="w-full min-h-[10rem] p-3 bg-canvasBase border border-muted outline-none rounded-md"
        />
      </label>
      <label className="w-full flex flex-col gap-2">
        <span>
          How did you hear about us?
          {/* <span className="text-warning">*</span> */}
        </span>
        <input
          type="text"
          name="survey"
          onChange={(e) => setSurvey(e.target.value)}
          className="w-full p-3 bg-canvasBase border border-muted outline-none rounded-md"
        />
      </label>
      {/* <label className="w-full flex flex-col gap-2">
        What's the size of your engineering team?
        <select
          name="teamSize"
          defaultValue=""
          required
          onChange={(e) => setTeamSize(e.target.value)}
          className="px-3 py-3 bg-canvasBase border border-muted outline-none rounded-md"
        >
          <option value="" disabled>
            Select an option
          </option>
          <option value="2-9">2-9</option>
          <option value="10-30">10-30</option>
          <option value="30-99">30-99</option>
          <option value="100+">100+</option>
        </select>
      </label> */}
      <div className="mt-4 w-full flex flex-row justify-items-end">
        <button
          type="submit"
          disabled={disabled}
          className={`button group inline-flex items-center justify-center gap-0.5 rounded-lg text-base font-medium tracking-tight transition-all px-10 py-2.5 bg-cta hover:bg-ctaHover text-carbon-1000 font-medium ${
            disabled ? "opacity-50" : ""
          }`}
        >
          {buttonCopy}
        </button>
      </div>
    </form>
  );
}
