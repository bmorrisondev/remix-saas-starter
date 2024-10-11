import type { MetaFunction } from "@remix-run/node";
import { getAuth } from '@clerk/remix/ssr.server'
import { LoaderFunction, redirect } from '@remix-run/node'
import { useMutation, useQuery } from "convex/react";
import { api } from "convex/_generated/api";
import { useState } from "react";
import { UserButton } from "@clerk/remix";
import { Input } from "~/components/ui/input";
import { Button } from "~/components/ui/button";
import { CheckCircledIcon, CircleIcon } from "@radix-ui/react-icons";

export const loader: LoaderFunction = async (args) => {
  const { userId } = await getAuth(args)
  if (!userId) {
    return redirect('/sign-in')
  }
  return {}
}

export const meta: MetaFunction = () => {
  return [
    { title: "New Remix App" },
    { name: "description", content: "Welcome to Remix!" },
  ];
};

export default function Index() {
  const [taskName, setTaskName] = useState("")
  const addTaskMutation = useMutation(api.tasks.addTask)
  const toggleTaskStateMutation = useMutation(api.tasks.toggleTaskState)
  const tasks = useQuery(api.tasks.getTasks)

  async function onSaveClicked() {
    await addTaskMutation({
      name: taskName
    })
    setTaskName("")
  }

  async function onCheckClicked(_id: string) {
    await toggleTaskStateMutation({
      _id
    })
  }

  return (
    <div>
      <div className="bg-slate-50 border-b border-slate-200 flex justify-between p-2">
        <div>
          Remix SaaS Starter
        </div>
        <UserButton />
      </div>
      <div className="flex flex-col p-8 justify-center">
        <div className="flex gap-2 flex-1">
          <Input value={taskName} onChange={e => setTaskName(e.target.value)} />
          <Button onClick={onSaveClicked}>Save task</Button>
        </div>
        {tasks?.map(t => (
          <div key={t._id} className="flex gap-2 items-center">
            <Button variant="link" onClick={() => onCheckClicked(t._id)}>
              {t.is_completed ? <CheckCircledIcon /> : <CircleIcon />}
            </Button>
            <span>
              {t.name}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}