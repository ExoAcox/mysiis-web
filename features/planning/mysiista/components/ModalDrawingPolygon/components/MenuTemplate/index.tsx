import { useState } from "react";

import { tw } from "@functions/style";

import { menuTemplate } from "@features/planning/mysiista/function";
import { handlePriority } from "@features/planning/mysiista/function/drawing";

type PrioritasState = "prioritas-1" | "prioritas-2" | "prioritas-3" | "drop";

export default function MenuTemplate() {
    const [active, setActive] = useState<PrioritasState>("prioritas-1");

    const handleClass = (value: PrioritasState) => {
        return tw(
            "flex justify-center items-center gap-3 border-2 border-secondary-30 rounded-lg p-[16px] w-full",
            active === value && "border-primary-40 bg-primary-10"
        );
    };

    const handleBtn = (value: PrioritasState, priority: number) => {
        setActive(value);
        handlePriority(value, priority);
    };

    return (
        <div className="flex gap-[16px] mt-5">
            {menuTemplate.map((item, index) => {
                const Icon = item.icon;
                return (
                    <button
                        data-testid="btn-priority"
                        key={`${item.value}.${index.toString()}`}
                        onClick={() => handleBtn(item.value, item.priority)}
                        className={handleClass(item.value)}
                    >
                        <Icon className="text-2xl" /> <span>{item.label}</span>
                    </button>
                );
            })}
        </div>
    );
}
