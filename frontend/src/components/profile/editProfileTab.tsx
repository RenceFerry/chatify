import { useState } from "react";
import { onChange } from "../../utils/helpers";
import { EditProfileSchema } from "../../utils/schema";
import z from 'zod';

const MAX_TEXTAREA_HEIGHT = 150; // Maximum height in pixels
const MAX_BIO_LENGTH = 150;

type Error = { errors: string[]; properties?: { username?: { errors: string[]; } | undefined; email?: { errors: string[]; } | undefined; } | undefined; };

const EditProfileTab = ({setIsOpen}: { setIsOpen: React.Dispatch<React.SetStateAction<boolean>> }) => {
  const [ characterCount, setCharacterCount ] = useState(0);
  const [ error, setError ] = useState<Error>();

  const onTextareaChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    onChange(e, MAX_TEXTAREA_HEIGHT);
    const textarea = e.currentTarget;

    if (textarea.value.length > MAX_BIO_LENGTH) {
      textarea.value = textarea.value.slice(0, MAX_BIO_LENGTH);
    }

    setCharacterCount(textarea.value.length);
  }

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const formdata = new FormData(form);
    const data = Object.fromEntries(formdata.entries());

    const validatedData = EditProfileSchema.safeParse(data);

    if (!validatedData.success) {
      return setError(z.treeifyError(validatedData.error))
    }
  }

  return (
    <div className="absolute bottom-0 right-0 w-full flex flex-col justify-center items-center bg-back py-5 rounded-tl-xl rounded-tr-xl gap-5 h-[75%]">
      <h1 className="text-text font-bold text-xl">Edit Profile</h1>
      <form onSubmit={handleSubmit} className="w-[85%] max-w-96 flex flex-col justify-center items-center gap-2 border-2 border-blueC rounded-lg p-4">
        <div className="flex w-full flex-col justify-center gap-1 items-start">
          <label htmlFor="name" className="text-textB">Name</label>
          <input type="text" id="name" name="username" className="w-full h-12 rounded-lg bg-back border border-textC px-3 text-text outline-none"/>

          { error?.properties?.username?.errors[0] &&
            <p className="text-error text-md">{error?.properties?.username?.errors[0]}</p>
          }
        </div>
        
        <div className="flex w-full flex-col justify-center gap-1 items-start">
          <label htmlFor="email" className="text-textB">Email</label>
          <input type="text" id="email" name="email" className="w-full h-12 rounded-lg bg-back border border-textC px-3 text-text outline-none"/>

          { error?.properties?.email?.errors[0] &&
            <p className="text-error text-md">{error?.properties?.email?.errors[0]}</p>
          }
        </div>

        <div className="flex w-full flex-col justify-center gap-1 items-start">
          <label htmlFor="bio" className="text-textB">Bio</label>
          <textarea onChange={onTextareaChange} id="bio" name="bio" className="no-scrollbar w-full h-10 rounded-lg bg-back border border-textC px-3 text-text outline-none resize-none"/>

          <span className="text-textB text-sm">{characterCount}/{MAX_BIO_LENGTH}</span>
        </div>



        <div className="w-full flex flex-row jusitify-center items-center gap-3 mt-6">
          <button type="button" onClick={() => setIsOpen(false)} className="flex-1 bg-blueA rounded-full h-12 text-blueD hover:bg-hblueA font-semibold text-lg">Cancel</button>

          <button type="submit" className="flex-1 bg-blueC rounded-full h-12 text-blueA hover:bg-hblueC font-semibold text-lg">Save</button>
        </div>

      </form>
    </div>
  )
}

export default EditProfileTab;