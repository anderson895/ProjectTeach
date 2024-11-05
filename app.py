from flask import Flask, render_template

app = Flask(__name__)

@app.route('/')
def landing():
    message = "Hello, this message is dynamic!"
    return render_template('index.html', message=message)

@app.route('/admin/login')
def admin_login():
    return render_template('admin/login.html')

@app.route('/admin/register')
def admin_register():
    return render_template('admin/registration.html')

@app.route('/student/login')
def student_login():
    return render_template('student/login.html')

@app.route('/student/register')
def student_register():
    return render_template('student/registration.html')

if __name__ == '__main__':
    app.run(port=5001)
