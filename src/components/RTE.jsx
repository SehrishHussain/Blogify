import { Editor } from '@tinymce/tinymce-react'
import React from 'react'
import { Controller } from 'react-hook-form'

export default function RTE({name, control, label, defaultValue=''}) {
  return ( // control as parameter passes control from this component to the form where its being called
    <div className='w-full'>
        {label && <label className='inline-block mb-1 pl-1'>{label}</label>}
    <Controller
    name={name || "content"} // whatever name was called, variable i.e {}
    control={control} // control will give controll to parent element to use fields etc
    render={({field: {onChange}}) => ( // any change happens in this field inform us via a render
        // next is place watevr element we want to render i/e Editor
            <Editor
            apiKey='kfpaup2c8cv86a5ehtgm4tpjazsfwa0whoyn9tm4aw55y1q9'
            initialValue={defaultValue}
            init={{
                initialValue: defaultValue,
                height: 500,
                menubar: true,
                plugins: [
                    "image",
                    "advlist",
                    "autolink",
                    "lists",
                    "link",
                    "image",
                    "charmap",
                    "preview",
                    "anchor",
                    "searchreplace",
                    "visualblocks",
                    "code",
                    "fullscreen",
                    "insertdatetime",
                    "media",
                    "table",
                    "code",
                    "help",
                    "wordcount",
                    "anchor",
                ],
                toolbar:
                "undo redo | blocks | image | bold italic forecolor | alignleft aligncenter bold italic forecolor | alignleft aligncenter alignright alignjustify | bullist numlist outdent indent |removeformat | help",
                content_style: "body { font-family:Helvetica,Arial,sans-serif; font-size:14px }"
            }}
            onEditorChange={onChange}
            />
    )}
    />
   
    </div>
  
  )
}
