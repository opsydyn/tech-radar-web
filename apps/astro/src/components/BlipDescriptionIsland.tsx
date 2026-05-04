import { useState } from "react";
import { LexicalDescriptionEditor } from "@/components/LexicalDescriptionEditor";

export default function BlipDescriptionIsland({ initialDescription }: { initialDescription: string }) {
  const [description, setDescription] = useState(initialDescription);

  return (
    <LexicalDescriptionEditor
      initialValue={description}
      onSave={setDescription}
    />
  );
}
