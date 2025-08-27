import React from "react";
import Title from "../components/Title";
import { assets } from "../assets/assets";
import NewsletterBox from "../components/NewsletterBox";

const About = () => {
  return (
    <div>
      <div className="text-2xl text-center pt-8 border-t">
        <Title text1={"ABOUT"} text2={"US"} />
      </div>

      <div className="my-10 flex flex-col md:flex-row gap-16">
        <img
          className="w-full md:max-w-[450px]"
          src={assets.about_img}
          alt=""
        />
        <div className="flex flex-col justify-center gap-6 md:w-2/4 text-gray-600">
          <p>
            At Forever, we believe style is timeless and confidence never goes
            out of fashion. Our journey began with a simple vision - to create a
            space where quality, comfort, and trend meet seamlessly.
          </p>
          <p>
            We're more than just a brand; we're a community built around
            individuality, self-expression, and sustainability. Every piece we
            design and curate is inspired by the people who wear them - bold,
            unique, and forever moving forward.
          </p>
          <p className="text-gray-800">Our Mission</p>
          <p>
            At Forever, our mission is to empower individuals to express
            themselves through fashion that blends timeless elegance with modern
            trends. We are committed to delivering high-quality, affordable, and
            comfortable apparel that inspires confidence in every moment. By
            embracing sustainability, inclusivity, and innovation, we strive to
            create a fashion destination where everyone can find their unique
            style and feel truly limitless.
          </p>
        </div>
      </div>
      <div className="text-4xl py-4">
        <Title text1={"WHY"} text2={"CHOOSE US"} />
      </div>
      <div className="flex flex-col md:flex-row text-sm mb-20">
        <div className="border px-10 md:px-16 py-8 sm:py-20 flex flex-col gap-5">
          <b>Quality Assurance:</b>
          <p className="text-gray-600">
            At Forever, we never compromise on quality. Every product goes
            through a careful selection and inspection process to ensure it
            meets our high standards of durability, comfort, and style. From
            premium fabrics to precise craftsmanship, our commitment to
            excellence ensures you receive fashion that lasts and feels as good
            as it looks.
          </p>
        </div>
        <div className="border px-10 md:px-16 py-8 sm:py-20 flex flex-col gap-5">
          <b>Convenience:</b>
          <p className="text-gray-600">
            Your shopping experience matters to us. That’s why Forever is
            designed to make fashion accessible with ease. From smooth
            navigation and secure checkout to fast delivery and easy returns, we
            prioritize your convenience at every step.
          </p>
        </div>
      </div>
      <NewsletterBox/>
    </div>
  );
};

export default About;
