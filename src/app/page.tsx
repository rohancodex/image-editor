"use client";
import ImageEditor from "@/components/molecules/ImageEditor";
import ImageUpload from "@/components/molecules/ImageUpload";
import { useRouter } from "next/navigation";
import { useLayoutEffect, useState } from "react";

export default function Home() {
  const router = useRouter();
  useLayoutEffect(() => {
    const isAuth = localStorage.getItem("image-editor-login");
    if (!isAuth) {
      router.replace("/login");
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
