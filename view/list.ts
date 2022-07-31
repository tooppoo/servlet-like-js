import {Renderer} from "@servlet/renderer";
import {Todo} from "@app/list-display";

interface ListAttr {
    todoList: Todo[]
}
export const list: Renderer<ListAttr> = attr => `
<h1>TODOリスト</h1>
<ul>
    ${attr.todoList.map(todo)}
</ul>
`
const todo = (todo: Todo) => `
<li>
    <h2>${todo.comment}</h2>
    <div>${todo.comment}</div>
</li>
`