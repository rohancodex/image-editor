"use client";
import ImageEditor from "@/components/molecules/ImageEditor";
import ImageUpload from "@/components/molecules/ImageUpload";
import { redirect } from "next/navigation";
import { useLayoutEffect, useState } from "react";

export default function Home() {
  useLayoutEffect(() => {
    const isAuth = localStorage.getItem("image-editor-login");
    if (!isAuth) {
      redirect("/login");
    }
  }, []);

  const [image, setImage] = useState<string | null>(null);

  const handleImageUpload = (uploadedImage: string | ArrayBuffer | null) => {
    if (typeof uploadedImage === "string") setImage(uploadedImage);
  };

  return (
    <main className=" min-h-screen p-24">
      <section className="flex flex-col items-center gap-16">
        <ImageUpload onImageUpload={handleImageUpload} />
        {image ? <ImageEditor imageUrl={image} /> : null}
      </section>
    </main>
  );
}
