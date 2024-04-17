import React, { useState } from "react"

export const Button = (props: { className: string }) => {
  return <button className={props.className}></button>
}

const Parent = () => {
  const [arr, neverArr] = useState([])
  const z = []
  return (
    <>
      /* @ts-expect-error */
      <Button></Button>
      <Button className="my-class"></Button>
    </>
  )
}
// typing component
const Title = ({
  children,
  title
}: {
  title: string
  children: React.ReactNode
}): React.JSX.Element => <div title={title}>{children}</div>

;<Title title="s"> </Title>
