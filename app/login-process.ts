import {HttpServlet} from "@servlet/http-servlet";
import {HttpRequest} from "@servlet/request";
import {HttpResponse} from "@servlet/response";

export class LoginProcessServlet extends HttpServlet {
    protected async doPost(req: HttpRequest, res: HttpResponse): Promise<void> {
        const loginId = req.getParameter('loginId')
        const password = req.getParameter('password')

        req.setAttribute('loginId', loginId)
        req.setAttribute('password', password)

        if (loginId === null || loginId.length === 0) {
            req.setAttribute('errorMessage', 'ログインIDは必須です')
            return await req.getRequestDispatcher('/login').forward(req, res)
        }
        if (password === null || password.length === 0) {
            req.setAttribute('errorMessage', 'パスワードは必須です')
            return await req.getRequestDispatcher('/login').forward(req, res)
        }
        if (loginId !== 'user1' || password !== 'password') {
            req.setAttribute('errorMessage', 'ユーザーIDまたはパスワードが一致しません')
            return await req.getRequestDispatcher('/login').forward(req, res)
        }

        res.sendRedirect(req.getContextPath() + '/list')
    }
}
