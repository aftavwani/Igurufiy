import React, { useState, useRef } from "react";
import parse from "html-react-parser";

const TestPopUp: React.FC = () => {
  const response =
    "<p>No one is impervious to scams but some people are more vulnerable than others. Even the smart ones can become victims of con artists and fake gurus. It&rsquo;s not because they&rsquo;ve suddenly become stupid, but it&rsquo;s because scammers know who to target and they use psychology, technology, and opportunity to run their scams.</p> <p>Fake gurus on YouTube and Instagram know how to manipulate their targets by employing psychological techniques. It helps their con tremendously if they are charismatic and innately fascinating. The combination of cunning and magnetic personality is hard to resist especially when the scam is hidden under the guise of authority and legitimacy.<br />If you&rsquo;re wondering why people are falling for scams created by fake gurus online, it&rsquo;s because of the following reasons:</p>";
  const regex = /<p>(.*?)<\/p>/;
  const corresp = regex.exec(response);
  const firstParagraph = corresp ? corresp[0] : ""; // <p>text1</p>
  const firstParagraphWithoutHtml = corresp ? corresp[1] : ""; // text1

  return (
    <>
      <h1>Hello World!</h1>

      {parse(firstParagraph)}

      {firstParagraphWithoutHtml}
    </>
  );
};
export default TestPopUp;
