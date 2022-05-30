import {
  ChatIcon,
  DotsHorizontalIcon,
  EmojiHappyIcon,
  HeartIcon,
  PaperAirplaneIcon,
  BookmarkIcon,
} from '@heroicons/react/outline'
import { HeartIcon as HeartIconFilled } from '@heroicons/react/solid'
import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  onSnapshot,
  orderBy,
  query,
  serverTimestamp,
  setDoc,
} from 'firebase/firestore'
import { useSession } from 'next-auth/react'
import { useEffect, useState } from 'react'
import { db } from '../firebase'
import Moment from 'react-moment'

function Post({ id, userImg, img, userName, caption }) {
  const { data: session } = useSession()
  const [comment, setComment] = useState('')
  const [comments, setComments] = useState([])
  const [likes, setLikes] = useState([])
  const [hasLiked, setHasLiked] = useState([])

  useEffect(() => {
    onSnapshot(
      query(
        collection(db, 'posts', id, 'comments'),
        orderBy('timestamp', 'desc')
      ),
      (snapshot) => setComments(snapshot.docs)
    )
  }, [db, id])

  useEffect(
    () =>
      onSnapshot(collection(db, 'posts', id, 'likes'), (snapshot) =>
        setLikes(snapshot.docs)
      ),
    [db, id]
  )

  useEffect(() => {
    setHasLiked(likes.findIndex((like) => like.id === session.user.uid) !== -1)
  }, [likes])

  const likePost = async () => {
    if (hasLiked) {
      await deleteDoc(doc(db, 'posts', id, 'likes', session.user.uid))
    } else {
      await setDoc(doc(db, 'posts', id, 'likes', session.user.uid), {
        userName: session.user.username,
      })
    }
  }

  console.log(hasLiked)

  const sendComment = async (e) => {
    e.preventDefault()

    const commentToSend = comment
    setComment('')

    await addDoc(collection(db, 'posts', id, 'comments'), {
      comment: commentToSend,
      userName: session.user.username,
      userImg: session.user.image,
      timestamp: serverTimestamp(),
    })
  }
  return (
    <div className="my-7 rounded-sm border bg-white">
      {/* Header  */}
      <div className="flex items-center p-5">
        <img
          src={userImg}
          alt="User Image"
          className="mr-3 h-12 w-12 rounded-full border object-contain p-1"
        />
        <p className="flex-1">{userName}</p>
        <DotsHorizontalIcon className="h-5" />
      </div>
      {/* Feed Image  */}
      <img src={img} alt="Feed Image" className="w-full object-contain" />
      {/* Buttons  */}
      {session ? (
        <div className="flex justify-between px-4 pt-4">
          <div className="flex space-x-4 ">
            {hasLiked ? (
              <HeartIconFilled
                onClick={likePost}
                className="btn text-red-500"
              />
            ) : (
              <HeartIcon onClick={likePost} className="btn" />
            )}
            <ChatIcon className="btn" />
            <PaperAirplaneIcon className="btn rotate-45" />
          </div>
          <BookmarkIcon className="btn" />
        </div>
      ) : (
        ''
      )}

      {/* Caption  */}

      <p className="truncate p-5">
        {likes.length > 0 && (
          <p className="mb-1 font-bold">{likes.length} likes</p>
        )}
        <span className="mr-1 font-bold">{userName}</span>
        {caption}
      </p>
      {/* Comments Section  */}

      {comments.length > 0 && (
        <div className="ml-10 h-20 overflow-y-scroll scrollbar-thin scrollbar-thumb-black">
          {comments.map((comment) => (
            <div key={comment.id} className="mb-3 flex items-center space-x-2">
              <img
                src={comment.data().userImg}
                alt=""
                className="h-7 rounded-full"
              />
              <p className="flex-1 text-sm">
                <span className="font-bold">{comment.data().userName}</span>{' '}
                {comment.data().comment}
              </p>
              <Moment fromNow className="pr-5 text-xs text-gray-400">
                {comment.data().timestamp?.toDate()}
              </Moment>
            </div>
          ))}
        </div>
      )}

      {/* Input Field  */}
      {session ? (
        <form className="flex items-center p-4">
          <EmojiHappyIcon className="h-7" />
          <input
            type="text"
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            placeholder="Add a comment..."
            className="flex-1 border-none outline-none focus:ring-0"
          />
          <button
            type="submit"
            onClick={sendComment}
            disabled={!comment.trim()}
            className="font-semibold text-blue-400"
          >
            Post
          </button>
        </form>
      ) : (
        ''
      )}
    </div>
  )
}

export default Post
