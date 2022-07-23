import {Renderer} from "@servlet/renderer";

interface LoginAttr {
    errorMessage?: string
}

export const login: Renderer<LoginAttr> = attr => `
<h1>Login</h1>
<div class="error">
    ${attr.errorMessage || ''}
</div>
<form>
    <div>
        ID: <input id="user_id">
    </div>
    <div>
        パスワード: <input id="password" type="password">
    </div>
    <div>
        <button type="submit">ログイン</button>
    </div>
</form>
`
