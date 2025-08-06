# client/ui.py
import tkinter as tk
from tkinter import messagebox
from speech import speak, listen
from nlp import extract_keywords
import requests

# 1) API_URL artık /api ile başlıyor
API_URL = "http://localhost:5000/api"

jwt_token = None   # global token

def start_app():
    root = tk.Tk()
    root.title('Sesli Çocuk Günlüğü')
    show_auth(root)
    root.mainloop()

def show_auth(root):
    for w in root.winfo_children(): w.destroy()
    tk.Label(root, text="Hoş geldin!").pack(pady=10)

    tk.Label(root, text="E-Posta:").pack()
    email_entry = tk.Entry(root); email_entry.pack()
    tk.Label(root, text="Parola:").pack()
    pass_entry = tk.Entry(root, show="*"); pass_entry.pack()

    def do_login():
        resp = requests.post(f"{API_URL}/auth/login",
                             json={
                               "email":    email_entry.get(),
                               "password": pass_entry.get()
                             })
        if resp.ok:
            global jwt_token
            jwt_token = resp.json().get("token")
            speak("Giriş başarılı.")
            ask_reading_mode(root)
        else:
            messagebox.showerror("Hata", "E-posta veya parola yanlış.")

    tk.Button(root, text="Giriş Yap", command=do_login).pack(pady=5)
    tk.Label(root, text="Hesabın yok mu?").pack(pady=(20,5))
    tk.Button(root, text="Kayıt Ol", command=lambda: show_register(root)).pack()

def show_register(root):
    for w in root.winfo_children(): w.destroy()
    tk.Label(root, text="Kayıt Ol").pack(pady=10)
    tk.Label(root, text="Kullanıcı Adı:").pack()
    name_entry = tk.Entry(root); name_entry.pack()
    tk.Label(root, text="E-Posta:").pack()
    email_entry = tk.Entry(root); email_entry.pack()
    tk.Label(root, text="Parola:").pack()
    pass_entry = tk.Entry(root, show="*"); pass_entry.pack()

    def do_register():
        resp = requests.post(f"{API_URL}/auth/register",
                             json={
                               # 2) backend User modelinde username olarak tanımlı
                               "username": name_entry.get(),
                               "email":    email_entry.get(),
                               "password": pass_entry.get()
                             })
        if resp.ok:
            speak("Kayıt başarılı! Lütfen giriş yap.")
            show_auth(root)
        else:
            messagebox.showerror("Hata", "Kayıt başarısız oldu.")

    tk.Button(root, text="Kayıt Ol", command=do_register).pack(pady=10)
    tk.Button(root, text="Geri", command=lambda: show_auth(root)).pack()

def ask_reading_mode(root):
    for w in root.winfo_children(): w.destroy()
    tk.Label(root, text='Okuma yazma biliyor musun?').pack(pady=10)
    btn_frame = tk.Frame(root)
    btn_frame.pack()
    tk.Button(btn_frame, text='Evet', width=10,
              command=lambda: open_entry(root, mode='text')).grid(row=0, column=0, padx=5)
    tk.Button(btn_frame, text='Hayır', width=10,
              command=lambda: open_entry(root, mode='voice')).grid(row=0, column=1, padx=5)

def open_entry(root, mode):
    for widget in root.winfo_children(): widget.destroy()
    tk.Label(root, text='Günlüğünü yaz veya söyle:').pack(pady=10)
    if mode == 'text':
        text_box = tk.Text(root, height=10, width=50)
        text_box.pack(pady=5)
        tk.Button(root, text='Kaydet',
                  command=lambda: submit_entry(root, mode, text_box.get("1.0", tk.END))).pack(pady=10)
    else:
        tk.Button(root, text='🎤 Ses Kaydet & Gönder',
                  command=lambda: submit_entry(root, mode, None)).pack(pady=10)

def submit_entry(root, mode, manual_text):
    try:
        # sesli veya yazılı metni al
        text = listen() if mode=='voice' else manual_text.strip()
        if not text:
            speak("Lütfen bir şey yaz veya söyle.")
            return

        keywords = extract_keywords(text)
        headers = {'Authorization': f'Bearer {jwt_token}'}
        # 3) backend /entries endpoint’i content ve keywords bekliyor
        payload = {'content': text, 'keywords': keywords}

        res = requests.post(f'{API_URL}/entries', json=payload, headers=headers)
        if res.ok:
            speak('Günlüğün kaydedildi!')
        else:
            # hata ayrıntısını konsola da basabiliriz:
            print("Hata cevabı:", res.status_code, res.text)
            speak('Kayıt sırasında hata oluştu.')
    except requests.exceptions.ConnectionError:
        speak("Sunucuya ulaşılamadı. Backend çalışıyor mu kontrol et.")
    except Exception as e:
        speak(f'Hata: {e}')

    # tekrar mod seçimine dön
    ask_reading_mode(root)

if __name__ == '__main__':
    start_app()
