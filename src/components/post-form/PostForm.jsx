import { useForm } from "react-hook-form";
import React, { useCallback, useState } from "react";
import { Button, Input, Select, RTE } from "../index";
import { blogService } from "../../services";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";

export default function PostForm({ post }) {
  const dispatch = useDispatch();
  const { register, handleSubmit, watch, setValue, control, getValues } = useForm({
    defaultValues: {
      title: post?.title || "",
      slug: post?.$id || "",
      content: post?.content || "",
      status: post?.status || "active",
    },
  });

  const navigate = useNavigate();
  const userData = useSelector((state) => state.auth.userData);
  console.log("🔥 userData from Redux:", userData);

  const [loading, setLoading] = useState(false);

  const submit = async (data) => {
    setLoading(true);
    try {
      // ❌ Remove upload logic, just keep local field
      // let file = null;
      // if (data.image?.[0]) {
      //   file = await blogService.uploadFile(data.image[0]);
      //   if (post && post.featuredImage) {
      //     await blogService.deleteFile(post.featuredImage);
      //   }
      // }

      if (post) {
        const dbPost = await blogService.updatePost(post.$id, {
          ...data,
          // featuredImage: file ? file.$id : post.featuredImage,
        });
        if (dbPost) navigate(`/post/${dbPost.slug}`);
      } else {
        // if (file) data.featuredImage = file.$id;
        const dbPost = await blogService.createPost(
          {
            ...data,
            userId: userData.$id,
          },
          dispatch
        );
        if (dbPost) navigate(`/post/${dbPost.slug}`);
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

  React.useEffect(() => {
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
        {/* File input commented out since we're mock-only */}
        {/* <Input
          label="Featured Image :"
          type="file"
          className="mb-4"
          accept="image/png, image/jpg, image/jpeg, image/gif"
          {...register("image", { required: !post })}
        /> */}

        {post && post.featuredImage && (
          <div className="w-full mb-4">
            <img
              src={post.featuredImage}
              alt={post.title}
              className="rounded-lg"
            />
          </div>
        )}

        <Select
          options={["active", "inactive"]}
          label="Status"
          className="mb-4"
          {...register("status", { required: true })}
        />

        <Button
          type="submit"
          disabled={loading}
          bgColor={post ? "bg-green-500" : undefined}
          className={`w-full flex items-center justify-center transform transition-transform duration-200 active:scale-95 ${
            loading ? "opacity-70 cursor-not-allowed" : ""
          }`}
        >
          {loading ? (
            <>
              <svg
                className="animate-spin h-5 w-5 mr-2 text-white"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                ></circle>
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8v4l3-3-3-3v4a8 8 0 000 16z"
                ></path>
              </svg>
              {post ? "Updating..." : "Submitting..."}
            </>
          ) : post ? (
            "Update"
          ) : (
            "Submit"
          )}
        </Button>
      </div>
    </form>
  );
}
