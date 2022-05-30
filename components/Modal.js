import React, { Fragment, useRef, useState } from 'react'
import { useRecoilState } from 'recoil'
import { modalState } from '../atoms/modalAtom'
import { Dialog, Transition } from '@headlessui/react'
import { CameraIcon } from '@heroicons/react/outline'
import { db, storage } from '../firebase'
import {
  addDoc,
  collection,
  doc,
  serverTimestamp,
  updateDoc,
} from 'firebase/firestore'
import { useSession } from 'next-auth/react'
import { ref, getDownloadURL, uploadString } from 'firebase/storage'

function Modal() {
  const { data: session } = useSession()
  const [selectedFile, setSelectedFile] = useState(null)
  const [isOpen, setIsOpen] = useRecoilState(modalState)
  const [loading, setLoading] = useState(false)
  const filePickerRef = useRef(null)
  const captionRef = useRef(null)

  const uploadPost = async () => {
    if (loading) return

    setLoading(true)

    // 1) create a post and add to firestore 'posts' collection
    // 2) get the post ID for the newly created post
    // 3) upload the image to firestore with the post ID
    // 4) get a download url from firestore and update the original post with image

    const docRef = await addDoc(collection(db, 'posts'), {
      username: session.user.username,
      caption: captionRef.current.value,
      profileImg: session.user.image,
      timestamp: serverTimestamp(),
    })
    console.log('New doc added with ID', docRef.id)

    const imageRef = ref(storage, `posts/${docRef.id}/image`)

    await uploadString(imageRef, selectedFile, 'data_url').then(
      async (snapshot) => {
        const downloadURL = await getDownloadURL(imageRef)

        await updateDoc(doc(db, 'posts', docRef.id), {
          image: downloadURL,
        })
      }
    )
    setIsOpen(false)
    setLoading(false)
    setSelectedFile(null)
  }

  const addImageToPost = (e) => {
    const reader = new FileReader()

    if (e.target.files[0]) {
      reader.readAsDataURL(e.target.files[0])
    }

    reader.onload = (readerEvent) => {
      setSelectedFile(readerEvent.target.result)
    }
  }
  return (
    <Transition.Root show={isOpen} as={Fragment}>
      <Dialog
        as="div"
        className="fixed inset-0 z-10 overflow-y-auto"
        onClose={setIsOpen}
      >
        <div className="flex min-h-[800px] items-end justify-center px-4 pt-4 pb-20 text-center sm:block sm:min-h-screen sm:p-0">
          <Transition.Child
            as={Fragment}
            enter="duration-300 ease-out"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="duration-200 ease-in"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <Dialog.Overlay className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />
          </Transition.Child>
          {/* For Centering the Modal  */}
          <span
            className="hidden sm:inline-block sm:h-screen sm:align-middle"
            aria-hidden={true}
          >
            &#8203
          </span>
          <Transition.Child
            as={Fragment}
            enter="duration-300 ease-out"
            enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
            enterTo="opacity-100 sm:scale-100 translate-y-0"
            leave="duration-200 ease-in"
            leaveFrom="opacity-100 sm:scale-100 translate-y-0"
            leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
          >
            <div className="inline-block transform overflow-hidden rounded-lg bg-white px-4 pt-5 text-left align-bottom shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-sm sm:p-6 sm:align-middle">
              {selectedFile ? (
                <img
                  src={selectedFile}
                  className="w-full cursor-pointer object-contain"
                  onClick={() => setSelectedFile(null)}
                  alt=""
                />
              ) : (
                <div
                  className="mx-auto flex h-12 w-12 cursor-pointer items-center justify-center rounded-full bg-red-100"
                  onClick={() => filePickerRef.current.click()}
                >
                  <CameraIcon
                    className="h-6 w-6 text-red-600"
                    aria-hidden={true}
                  />
                </div>
              )}
              <div>
                <div className="mt-3 text-center sm:mt-5">
                  <Dialog.Title
                    as="h3"
                    className="text-lg font-medium leading-6 text-gray-900"
                  >
                    Upload a photo
                  </Dialog.Title>
                  <div>
                    <input
                      type="file"
                      onChange={addImageToPost}
                      ref={filePickerRef}
                      hidden
                    />
                  </div>
                  <div className="mt-2">
                    <input
                      type="text"
                      className="w-full border-none text-center focus:ring-0"
                      ref={captionRef}
                      placeholder="Enter a caption"
                    />
                  </div>
                </div>
                <div className="mt-5 sm:mt-6">
                  <button
                    type="button"
                    disabled={!selectedFile}
                    onClick={uploadPost}
                    className="inline-flex w-full justify-center rounded-md border border-transparent bg-red-600 px-4 py-2 text-base font-medium text-white shadow-sm hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-rose-500 focus:ring-offset-2 disabled:cursor-not-allowed disabled:bg-gray-300 hover:disabled:bg-gray-300 sm:text-sm"
                  >
                    {loading ? 'Uploading...' : 'Upload Post'}
                  </button>
                </div>
              </div>
            </div>
          </Transition.Child>
        </div>
      </Dialog>
    </Transition.Root>
  )
}

export default Modal
