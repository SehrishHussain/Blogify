import { useForm } from "react-hook-form";
import React, { useCallback, useState, useEffect } from "react";
import { Button, Input, Select, RTE } from "../index";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { addPost, updatePost } from "../../store/postSlice";

export default function PostForm({ post }) {
  const dispatch = useDispatch();
  const { register, handleSubmit, watch, setValue, control, getValues } = useForm({
    defaultValues: {
      title: post?.title || "",
      slug: post?.slug || "",
      content: post?.content || "",
      status: post?.status || "active",
      tags: post?.tags || [], // 🟢 initialize tags
    },
  });

  const navigate = useNavigate();
  const userData = useSelector((state) => state.auth.userData);
  const [loading, setLoading] = useState(false);
  const [tagInput, setTagInput] = useState(""); // 🟢 track tag text
  const [tags, setTags] = useState(post?.tags || []); // 🟢 display tags

  // 🟢 Watch form values to sync tags
  useEffect(() => {
    setValue("tags", tags);
  }, [tags, setValue]);

  const handleAddTag = (e) => {
    if (e.key === "Enter" || e.key === ",") {
      e.preventDefault();
      const newTag = tagInput.trim();
      if (newTag && !tags.includes(newTag)) {
        setTags([...tags, newTag]);
      }
      setTagInput("");
    }
  };

  const removeTag = (tagToRemove) => {
    setTags(tags.filter((tag) => tag !== tagToRemove));
  };

  const submit = async (data) => {
    setLoading(true);
    try {
      if (post) {
        const updated = await dispatch(
          updatePost({
            id: post.id,
            ...data,
          })
        ).unwrap();
        if (updated) navigate(`/post/${updated.slug}`);
      } else {
        const created = await dispatch(
          addPost({
            ...data,
            userId: userData.user.id,
            authorName: userData.user.name,
          })
        ).unwrap();
        if (created) navigate(`/post/${created.slug}`);
      }
    } catch (err) {
      console.error("Error submitting post:", err);
    } finally {
      setLoading(false);
    }
  };

  const slugTransform = useCallback((value) => {
    if (value && typeof value === "string")
      return value
        .trim()
        .toLowerCase()
        .replace(/[^a-zA-Z\d\s]+/g, "-")
        .replace(/\s/g, "-");
    return "";
  }, []);

  useEffect(() => {
    const subscription = watch((value, { name }) => {
      if (name === "title") {
        setValue("slug", slugTransform(value.title), { shouldValidate: true });
      }
    });
    return () => subscription.unsubscribe();
  }, [watch, slugTransform, setValue]);

  return (
    <form onSubmit={handleSubmit(submit)} className="flex flex-wrap">
      <div className="w-2/3 px-2">
        <Input
          label="Title :"
          placeholder="Title"
          className="mb-4"
          {...register("title", { required: true })}
        />
        <Input
          label="Slug :"
          placeholder="Slug"
          className="mb-4"
          {...register("slug", { required: true })}
          onInput={(e) =>
            setValue("slug", slugTransform(e.currentTarget.value), {
              shouldValidate: true,
            })
          }
        />
        <RTE
          label="Content :"
          name="content"
          control={control}
          defaultValue={getValues("content")}
        />
      </div>

      <div className="w-1/3 px-2">
        <Select
          options={["active", "inactive"]}
          label="Status"
          className="mb-4"
          {...register("status", { required: true })}
        />

        {/* 🟢 Tag Input */}
        <div className="mb-4">
          <label className="block mb-1 font-medium text-gray-700 dark:text-gray-300">
            Tags
          </label>
          <input
            type="text"
            value={tagInput}
            onChange={(e) => setTagInput(e.target.value)}
            onKeyDown={handleAddTag}
            placeholder="Type a tag and press Enter or ,"
            className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-400 focus:outline-none dark:bg-gray-800 dark:border-gray-600 dark:text-gray-100"
          />

          {/* 🟢 Display Tags */}
          <div className="flex flex-wrap gap-2 mt-3">
            {tags.map((tag, index) => (
              <span
                key={index}
                className="flex items-center gap-2 bg-blue-100 dark:bg-blue-800 text-blue-800 dark:text-blue-100 px-3 py-1 rounded-full text-sm font-medium transition-all hover:scale-105"
              >
                #{tag}
                <button
                  type="button"
                  onClick={() => removeTag(tag)}
                  className="text-blue-600 dark:text-blue-300 hover:text-red-500 font-bold"
                >
                  ✕
                </button>
              </span>
            ))}
          </div>
        </div>

        <Button
          type="submit"
          disabled={loading}
          bgColor={post ? "bg-green-500" : undefined}
          className={`w-full flex items-center justify-center transform transition-transform duration-200 active:scale-95 ${
            loading ? "opacity-70 cursor-not-allowed" : ""
          }`}
        >
          {loading ? (post ? "Updating..." : "Submitting...") : post ? "Update" : "Submit"}
        </Button>
      </div>
    </form>
  );
}
