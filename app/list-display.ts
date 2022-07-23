import {HttpServlet} from "@servlet/http-servlet";
import {HttpRequest} from "@servlet/request";
import {HttpResponse} from "@servlet/response";

export class Todo {
    constructor(readonly title: string, readonly comment: string) {}
}

export class ListDisplayServlet extends HttpServlet {
    protected async doGet(req: HttpRequest, res: HttpResponse): Promise<void> {
        const todoList: Todo[] = [
            new Todo('原稿を仕上げる', '締め切りは6/1'),
            new Todo('髪を切る', 'パーマかけようかな'),
        ]

        req.setAttribute('todoList', todoList)
        return req.getRequestDispatcher('list.ts#list').forward(req, res)
    }
}
