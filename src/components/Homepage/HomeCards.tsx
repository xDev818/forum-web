import { useGetUser, useGetComments, updateVotes } from "@/services/query"
import { UserTypes, Comments } from "@/types/types"
import { ArrowUp, MessageSquare, SendHorizontal, X } from "lucide-react"
import { useEffect, useState } from 'react'
import {Collapsible, CollapsibleContent, CollapsibleTrigger} from '@/components/ui/collapsible'
import { Popover, PopoverContent, PopoverTrigger } from  '@/components/ui/popover'
import axios from "axios"
import { Button } from "../ui/button"

export default function HomeCards() {

  const { isLoading: userLoad, data: userData, error: userError } = useGetUser();
  const { isLoading: commentsLoad, data: commentsData, error: commentsError } = useGetComments()

  const [vote, setVote] = useState(null);
  const [clicked, setClicked] = useState<boolean>(false);
  const [input, setInput] = useState<string>('');
  const [display, setDisplay] = useState<React.Component>()
  
  const COMMENTS_ENDPOINT = 'http://localhost:3000/comments';

  const handleChange = (e) => {
    setInput(e.target.value);
  }

  //post req
  const postComment = async (userId: number, id: number, comment: string,) => {
    try {
      const data = await axios.post(COMMENTS_ENDPOINT, 
        {
          userId: userId, 
          id: id, 
          comment: comment
        }).then(res => res.data);
      console.log(data);
      return data;
    } catch (e) {
      console.log(e);
    }
    
    setInput('');
  }

  //comments count
  const filterComments = (userid: number) => {
    return commentsData?.filter((comments: Comments<number, string>) => comments.userId == userid)
 }

 console.log(filterComments(1));

  //delete req
  const deleteComment = async (id: number) => {
      try {
        const delComment = await axios.delete(COMMENTS_ENDPOINT + '/' + id)
        const delData = await delComment.data;
        return delData;
      } catch (err) {
        console.log(err)
      }
  }
  
  //loading states
  if (userLoad || commentsLoad) <h1>Loading ...</h1>

  //error states
  if (userError || commentsError) <h1>Error</h1>

 
  return (
    
    <div className='mt-14 flex flex-col space-y-10 scroll-smooth mx-auto overflow-auto'>      
        {userData?.map((user: UserTypes<string, number, boolean>) => {

            return (
              <Collapsible key={user.id} className={`border rounded-md border-cyan-300 max-w-xl mx-auto p-5 shadow-md`}>
                
                <img src={user.posts.screenshot} className='mx-auto hover:cursor-pointer md:hover:scale-105 md:transform md:transition md:duration-200'/>
                <h1 className='text-3xl font-semibold mt-5'>{user.posts.title}</h1>
                <p className='text-md font-light mt-2'>{user.user_name}</p>

                <div className='flex flex-col mt-2'>
                  <p className='flex gap-2 text-gray-400'>repo:
                    <a className='text-sm italic leading-4 mt-1 underline' href="#"> {user.posts.repo} </a> 
                  </p>
                  
                  <p className='flex gap-2 text-gray-400'>live:
                    <a className='text-sm italic leading-4 mt-1 underline' href="#"> {user.posts.live_demo} </a> 
                  </p>
                 
                </div>
                
                <p className='mt-5'>{user.posts.summary}</p>

                <div className='flex gap-5 mt-2'>
                  <section className='flex gap-1 hover: cursor-pointer' onClick={() => {
                    setClicked(!clicked)
                    updateVotes(user, clicked, setVote)
                  }}>        

                    <ArrowUp size={18} className="mt-1" color={user.state ? user.color : user.unclicked}/>
                    
                    <p>{user.posts.upvote}</p>
                  </section> 
                  <CollapsibleTrigger className='flex gap-1 hover: cursor-pointer'>
                    <MessageSquare size={18} className='mt-1'/>
                    <p> {filterComments(user.id).length} </p>
                  </CollapsibleTrigger>
                </div>               
                
                <CollapsibleContent className="flex flex-col gap-2 xl:hidden">
                <h1 className='mt-10 text-lg font-semibold text-cyan-300 w-full border p-2 rounded-md bg-slate-800'>Comments</h1>
                  {commentsData?.map((comments: Comments<number, string>) => {
                      if(user.id == comments.userId) return (
                        <div key={comments.id} className='flex justify-between'>
                              <p className='mt-2 text-sm'>{comments.comment}</p>
                              <Popover>
                                <PopoverTrigger>
                                 <X size={25} color="gray"/>
                                </PopoverTrigger>
                                <PopoverContent className='flex flex-col text-center gap-4 w-40 sm:w-64 max-xl:w-100'>
                                  <p>Delete this comment?</p>
                                  <Button onClick={() => {
                                    deleteComment(comments.id)
                                  }}
                                  >Delete</Button>                                
                                </PopoverContent>
                              </Popover>
                        </div>
                      )
                    })}
                </CollapsibleContent>

                <div className="flex justify-between mt-2">
                  <input type='text'
                        className='bg-transparent w-full mt-2 outline-none p-2 rounded-md' 
                        placeholder="write a comment..."
                        value={input}
                        onChange={handleChange}/>
                  <SendHorizontal size={20}
                                  className='mt-4 mr-1 hover:cursor-pointer'
                                  color='cyan'
                                  onClick={() => {
                                    for (let i = 0; i<=commentsData?.length; i++) {
                                      if (user.id == commentsData[i]?.userId) {
                                        const ids = commentsData.length+1;
                                        return postComment(commentsData[i].userId, ids, input)
                                      }
                                    }
                                  }}/>
                </div>
                <p>{}</p>
                
              </Collapsible>
            )
        })}
    </div>
  )
}
