import { HttpServlet } from "@servlet/http-servlet"
import {HttpRequest} from "@servlet/request";
import {HttpResponse} from "@servlet/response";

export class LoginDisplayServlet extends HttpServlet {
    protected doGet(req: HttpRequest, res: HttpResponse): Promise<void> {
        return req.getRequestDispatcher('/login').forward(req, res)
    }
}
