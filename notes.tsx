import React, {
  ComponentProps,
  useCallback,
  useEffect,
  useMemo,
  useReducer,
  useRef,
  useState
} from "react"

// > typing functional components <
// React.JSX.Element could be inferred
// after react 18 you can no longer have children to be assigned implicitly as any

type TitleProps = {
  title: string
  children: React.ReactNode
}
// you can type the props inline or creating a type for them which is a lot neater
const Title = ({
  children,
  title
}:
  | {
      title: string
      children: React.ReactNode
    }
  | TitleProps) => <div title={title}>{children}</div>
// > typing the functional components return <
// using React.FunctionComponent or React.FC

{
  /** React.FC by default doesn't contain any props, and it doesn't let you pass any props in. */
}
const NewComponent: React.FC = (props: Props) => {
  return {
    ohDear: "123"
  }
}
// With props:
type Props = { name: string }

const MyComponent: FC<string> = (props) => {
  return { ohDear: "r" }
}

const Parent = () => {
  return (
    <>
      {/* Type '{ ohDear: string; }' is not assignable to type 'ReactNode'  as a child element // after changing that to a regular <div></div> */}
      <MyComponent propName="my-class"></MyComponent>
      // error under className
    </>
  )
}

// > @ts-expect-error directive to suppress error reporting <
const Button = (props: unknown) => {
  return (
    <>
      {/* @ts-expect-error 3 CHARACTERS OR MORE */}
      <button className={props.className}></button>

      <button className={props.className}></button>
      {/* error under `className` */}
    </>
  )
}
// > Using the ComponentProps Type Helper <

const CustomButton = ({ className, ...rest }: ComponentProps<"button">) => {
  return <button></button>
}
const MyParentComponent = () => {
  return <CustomButton></CustomButton> // Autocomplete is working because the props of CustomComponent are typed as a regular html button using  ComponentProps<"button">
}

// > Overriding and Removing Component Props <

type InputType = ComponentProps<"input">

// Then we can use Example and pass in a new onChange.

const ExampleInput: InputType = {
  onChange: () => {}
}

// Hovering over the onChange shows us that it must return a type of React.changeEventHandler<HTMLInputElement>.
// In order to make the example show us a type error, we need to use the Omit type helper to remove that key from the Example type we created:

type InputType_ = Omit<ComponentProps<"input">, "onChange">

export const Input = (
  props: Omit<ComponentProps<"input">, "onChange"> & {
    onChange: (value: string) => void
  }
) => {}

// > Creating a reusable type helper OverrideProps <

// This helper uses generics and takes in two type arguments for T and TOverridden.
// We would omit T from keyof TOverridden, then pass in & TOverridden:

type OverrideProps<T, TOverridden> = Omit<T, keyof TOverridden> & TOverridden

// Then we could create our InputProps and pass in the stuff we want to add:

type InputProps = OverrideProps<
  ComponentProps<"input">,
  {
    onChange: (value: string) => void
  }
>

export const Input_ = (props: InputProps) => {}

// > Use a Type Helper to Extract Component Props<

// There are two ways to use ComponentProps. You can pass it an actual HTML DOM element, or you can pass it an existing component.
// If we pass typeof NavBar, then ComponentProps will extract out all of the props from the NavBar itself.

type CustomButtonProps = ComponentProps<typeof CustomButton>
// NOTE: It's usually better to use ComponentPropsWithRef or ComponentPropsWithoutRef instead of this type, as they let you be explicit about whether or not to include the ref prop.

// >Typing UseState hook<

const EmptyComponent = () => {
  // unless givin a value the state type is going to be undefined | genertic type being passed which in this case string
  const [name, setName] = useState<string>()

  // once given a value it won't be a union of undefined and string types anymore
  const [state, setState] = useState<string>("")

  // also it won't accept another type like null for example as it's neither of type undefined or of type string
  const [age, setAge] = useState<string>(null)

  // > useState excess properties <

  // recap
  //in a regular object
  type RegularObjType = {
    // [index: string]: string | number
    name: string
    age: number
  }
  const RegularObj: RegularObjType = {
    name: "",
    age: 3,
    // in typescript adding excess property which doesn't exist in an object would throw an error
    hobbies: []
  }

  // The problem
  const EmptyComponent = () => {
    type user = {
      id: string
      name: string
      age: number
    }

    const [users, setUsers] = useState<user[]>([
      {
        age: 0,
        name: "",
        id: ""
      }
    ])
    useEffect(() => {
      // adding hobbies: [] which is an excess property doesn't throw an error
      // because in the previous version we were checking if the object matched another object
      // while in here we are checking if this function matches this function

      // and in typescript you are allowed to pass excess properties from the return values inside function
      // it was built like this to be more lenient/loose than it's excepted
      // could be prevented by typing the return of the callback function by user[]

      // setUsers((users):user[] => [
      setUsers((users) => [
        ...users,
        {
          name: "ahmad",
          age: 24,
          id: "07",
          hobbies: []
        }
      ])
    }, [])
  }

  type getRegularObjType = () => RegularObjType

  const getRegularObj: getRegularObjType = () => ({
    age: 3,
    name: "hey",
    hobbies: []
  })
}

// > UseEffect typing <
const useTimeout = (timerMs: number) => {
  // function useEffect(effect: EffectCallback, deps?: DependencyList): void;
  // type EffectCallback = () => void | Destructor;
  // UseEffect is expecting to return void and the function being passed as a callback is also expected to be returning void or Destructor which is
  // type Destructor = () => void | { [UNDEFINED_VOID_ONLY]: never };

  useEffect(() => {
    const timer = setTimeout(() => {
      console.log("Done!")
    }, timerMs)
    return () => clearTimeout(timer) // clearTimeout return type is void !d
  }, [timerMs])
}

// > UseCallback typing <
const MyTestCompnoent = () => {
  // const funcReturningStr: (userName: string) => string
  // typescript uses the type of the function being passed as a parameter and infers it to be the return type of the useCallback hook!
  // so in this case it's better if you relay on the inference of typescript
  type helloUserFuncType = (userName: string) => void
  const helloUserFunc = useCallback<helloUserFuncType>(
    (userName: string) => `hello, ${userName}`,
    []
  )
}
// NOTE: even though you are returning `hello, ${userName}` which is of type string a function that's typed to be returning void is not expected to be doing anything with it
// so it's technically fine to do that
const clear: () => void = () => "hey"

// >Typing useMemo hook<

export const Component = () => {
  // function useMemo<T>(factory: () => T, deps: DependencyList): T;
  // either to relay on the type inference of TS or type the return of the function that's being passed to the useMemo to avoid excess properties being added
  type enemy = {
    id: number
    hp: number
    weapon: string
  }
  const spawnEnemies = useMemo<enemy[]>(
    () =>
      // generate 100 random string uuid's
      Array.from(
        { length: 100 },
        (_, i): enemy => ({
          id: i,
          hp: ~~Math.random() * i,
          weapon: "sword",
          name: "excess_property"
        })
      ),
    []
  )
}

// >Typing UseRef hook<

export const TestComponent = () => {
  const ref = useRef<HTMLDivElement>(null)
  // hovering shows `HTMLDivElement | undefined` as javascript by default assign undefined to the value being passed to the useRef
  // const ref = useRef<HTMLDivElement>(null); // the pattern that should be used moving forward
  ref.current
  // ref.current should never be undefined because by default react manages the ref for you so if the TestComponent gets unmounted react will set the ref to null
  // so by setting null to the ref it  makes it a readonly ref and is managed by react.

  return <div ref={ref} />
}
// > Typing useReducer <
