import type { Writable } from "svelte/store";

export const halt = (evt: Event) => {
    evt.stopPropagation();
    evt.preventDefault();
};

export const toMap = (arr: any[]) => {
    const map: { [key: number]: any } = {};
    arr.forEach((item) => (map[item.id] = item));
    return map;
};

export const thumbResizer = (
    input: HTMLInputElement,
    imgSignal: Writable<string>
) => {
    const cb = (evt: any) => {
        const file = evt.target.files[0];
        const fr = new FileReader();
        fr.onloadend = (ev) => {
            const img = document.createElement("img");
            img.onload = () => {
                const h = img.naturalHeight;
                const w = img.naturalWidth;

                let topOffset = 0;
                let leftOffset = 0;
                let face = 0;

                if (h > w) {
                    face = w;
                    topOffset = (h - w) / 2;
                } else if (w > h) {
                    face = h;
                    leftOffset = (w - h) / 2;
                } else {
                    face = w;
                }

                const canvas = document.createElement("canvas");
                const ctx = canvas.getContext("2d");

                if (!ctx) {
                    return;
                }

                canvas.height = 128;
                canvas.width = 128;
                ctx.drawImage(
                    img,
                    leftOffset,
                    topOffset,
                    face,
                    face,
                    0,
                    0,
                    128,
                    128
                );
                const dataurl = canvas.toDataURL(file.type);
                imgSignal.set(dataurl);
                evt.target.value = null;
            };
            img.src = ev?.target?.result + "";
        };

        fr.readAsDataURL(file);
    };
    input.addEventListener("change", cb);
};
