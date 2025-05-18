from os import name
import matplotlib.pyplot as plt
import matplotlib.patches as patches
import numpy as np
import customtkinter as ctk
from tkinter import messagebox, filedialog


def liang_barsky(xmin, ymin, xmax, ymax, x1, y1, x2, y2):
    dx = x2 - x1
    dy = y2 - y1
    t0, t1 = 0.0, 1.0

    p = [-dx, dx, -dy, dy]
    q = [x1 - xmin, xmax - x1, y1 - ymin, ymax - y1]

    for i in range(4):
        if p[i] == 0:
            if q[i] < 0:
                return None
        else:
            t = q[i] / p[i]
            if p[i] < 0:
                t0 = max(t0, t)
            else:
                t1 = min(t1, t)

    if t0 > t1:
        return None
    x1_clip = x1 + t0 * dx
    y1_clip = y1 + t0 * dy
    x2_clip = x1 + t1 * dx
    y2_clip = y1 + t1 * dy

    return (x1_clip, y1_clip, x2_clip, y2_clip)


def sutherland_hodgman(polygon, clip_window):
    def inside(point, edge):
        x, y = point
        x1, y1, x2, y2 = edge
        return (x2 - x1) * (y - y1) - (y2 - y1) * (x - x1) >= 0

    def intersection(p1, p2, edge):
        x1, y1 = p1
        x2, y2 = p2
        x3, y3, x4, y4 = edge

        denominator = (x1 - x2) * (y3 - y4) - (y1 - y2) * (x3 - x4)
        if denominator == 0:
            return None

        px = ((x1 * y2 - y1 * x2) * (x3 - x4) - (x1 - x2) * (x3 * y4 - y3 * x4)) / denominator
        py = ((x1 * y2 - y1 * x2) * (y3 - y4) - (y1 - y2) * (x3 * y4 - y3 * x4)) / denominator
        return px, py

    clipped_polygon = polygon
    for i in range(len(clip_window)):
        new_polygon = []
        edge = (*clip_window[i], *clip_window[(i + 1) % len(clip_window)])
        for j in range(len(clipped_polygon)):
            current_point = clipped_polygon[j]
            prev_point = clipped_polygon[j - 1]

            if inside(current_point, edge):
                if not inside(prev_point, edge):
                    new_polygon.append(intersection(prev_point, current_point, edge))
                new_polygon.append(current_point)
            elif inside(prev_point, edge):
                new_polygon.append(intersection(prev_point, current_point, edge))
        clipped_polygon = new_polygon
    return clipped_polygon


def clip_polygon(vertices, xmin, ymin, xmax, ymax):
    clip_window = [(xmin, ymin), (xmax, ymin), (xmax, ymax), (xmin, ymax)]
    return sutherland_hodgman(vertices, clip_window)


def plot_clipping(xmin, ymin, xmax, ymax, segments, polygons):
    fig, ax = plt.subplots()

    window = patches.Rectangle((xmin, ymin), xmax - xmin, ymax - ymin,
                               linewidth=2, edgecolor='red', facecolor='none')
    ax.add_patch(window)

    for (x1, y1, x2, y2) in segments:
        ax.plot([x1, x2], [y1, y2], color='gray', linestyle='--')

    for (x1, y1, x2, y2) in segments:
        result = liang_barsky(xmin, ymin, xmax, ymax, x1, y1, x2, y2)
        if result:
            x1_clip, y1_clip, x2_clip, y2_clip = result
            ax.plot([x1_clip, x2_clip], [y1_clip, y2_clip], color='blue', linewidth=2)

    for polygon in polygons:
        x, y = zip(*polygon)
        ax.plot(x + (x[0],), y + (y[0],), color='green', linestyle='--')

        clipped = clip_polygon(polygon, xmin, ymin, xmax, ymax)
        if clipped:
            clipped = list(dict.fromkeys(clipped))
            clipped_x, clipped_y = zip(*clipped)
            ax.plot(clipped_x + (clipped_x[0],), clipped_y + (clipped_y[0],),
                    color='blue', linewidth=2, linestyle='-')
            ax.fill(clipped_x, clipped_y, edgecolor='blue', fill=False)

    ax.set_xlim(xmin - 5, xmax + 10)
    ax.set_ylim(ymin - 5, ymax + 10)
    ax.set_aspect('equal', adjustable='box')
    plt.xlabel('X')
    plt.ylabel('Y')
    plt.title('Результат отсечения многоугольников и отрезков')
    plt.grid(True)
    plt.show()


def load_data_from_file():
    file_path = filedialog.askopenfilename(title="Выберите файл", filetypes=[("Text files", "*.txt")])
    if not file_path:
        return None

    with open(file_path, 'r') as file:
        lines = file.readlines()
        n = int(lines[0].strip())
        segments = []
        for i in range(1, n + 1):
            x1, y1, x2, y2 = map(float, lines[i].strip().split())
            segments.append((x1, y1, x2, y2))
        m = int(lines[n + 1].strip())
        polygons = []
        current_line = n + 2
        for _ in range(m):
            k = int(lines[current_line].strip())
            vertices = []
            for j in range(current_line + 1, current_line + 1 + k):
                x, y = map(float, lines[j].strip().split())
                vertices.append((x, y))
            polygons.append(vertices)
            current_line += k + 1
        xmin, ymin, xmax, ymax = map(float, lines[current_line].strip().split())
    return xmin, ymin, xmax, ymax, segments, polygons


def main():
    def run_clipping():
        try:
            data = load_data_from_file()
            if data:
                xmin, ymin, xmax, ymax, segments, polygons = data
                plot_clipping(xmin, ymin, xmax, ymax, segments, polygons)
        except Exception as e:
            messagebox.showerror("Ошибка", f"Произошла ошибка: {e}")

    ctk.set_appearance_mode("Dark")
    ctk.set_default_color_theme("blue")
    root = ctk.CTk()
    root.title("Отсечение отрезков и многоугольников")
    root.geometry("500x300")

    frame = ctk.CTkFrame(root, corner_radius=10)
    frame.pack(pady=20, padx=20, fill="both", expand=True)

    title_label = ctk.CTkLabel(
        frame,
        text="Отсечение отрезков и многоугольников",
        font=("Arial", 18, "bold"),
        text_color="white"
    )
    title_label.pack(pady=20)

    run_button = ctk.CTkButton(
        frame,
        text="Загрузить файл для отсечения",
        command=run_clipping,
        height=40,
        font=("Arial", 14)
    )
    run_button.pack(pady=40)

    
    root.mainloop()


if __name__ == "__main__":
    main()
