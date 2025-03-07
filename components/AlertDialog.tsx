import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { CheckCircle, AlertCircle, Info, AlertTriangle } from "lucide-react";

interface AlertDialogProps {
    isOpen: boolean;
    onClose: () => void;
    title: string;
    text: string;
    icon?: "success" | "error" | "warning" | "info";
    confirmButtonText?: string;
    onConfirm?: () => void;
    showCancelButton?: boolean;
    cancelButtonText?: string;
    onCancel?: () => void;
}

export const AlertDialog = ({
    isOpen,
    onClose,
    title,
    text,
    icon = "info",
    confirmButtonText = "Aceptar",
    onConfirm,
    showCancelButton = false,
    cancelButtonText = "Cancelar",
    onCancel,
}: AlertDialogProps) => {
    const handleConfirm = () => {
        onConfirm?.(); // Ejecutar onConfirm si está definido
        onClose(); // Cerrar el diálogo
    };

    const handleCancel = () => {
        onCancel?.(); // Ejecutar onCancel si está definido
        onClose(); // Cerrar el diálogo
    };

    const getIcon = () => {
        switch (icon) {
            case "success":
                return <CheckCircle className="w-8 h-8 text-green-500" />;
            case "error":
                return <AlertCircle className="w-8 h-8 text-red-500" />;
            case "warning":
                return <AlertTriangle className="w-8 h-8 text-yellow-500" />;
            case "info":
            default:
                return <Info className="w-8 h-8 text-blue-500" />;
        }
    };

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent>
                <DialogHeader>
                    <div className="flex items-center space-x-2">
                        {getIcon()}
                        <DialogTitle>{title}</DialogTitle>
                    </div>
                </DialogHeader>
                <DialogDescription>{text}</DialogDescription>
                <DialogFooter>
                    {showCancelButton && (
                        <Button variant="outline" onClick={handleCancel}>
                            {cancelButtonText}
                        </Button>
                    )}
                    <Button onClick={handleConfirm}>{confirmButtonText}</Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
};

import { useState } from "react";

export const useAlertDialog = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [config, setConfig] = useState<Omit<AlertDialogProps, "isOpen" | "onClose">>({
        title: "",
        text: "",
        icon: "info",
        confirmButtonText: "Aceptar",
        showCancelButton: false,
        cancelButtonText: "Cancelar",
    });

    const [onConfirmCallback, setOnConfirmCallback] = useState<(() => void) | null>(null);
    const [onCancelCallback, setOnCancelCallback] = useState<(() => void) | null>(null);

    const fire = (
        props: Omit<AlertDialogProps, "isOpen" | "onClose"> & {
            onConfirm?: () => void;
            onCancel?: () => void;
        }
    ) => {
        setConfig(props); // Actualizar la configuración
        setOnConfirmCallback(() => props.onConfirm || null); // Guardar la función onConfirm
        setOnCancelCallback(() => props.onCancel || null); // Guardar la función onCancel
        setIsOpen(true); // Abrir el diálogo
    };

    const close = () => {
        setIsOpen(false); // Cerrar el diálogo
        setConfig({ // Limpiar la configuración
            title: "",
            text: "",
            icon: "info",
            confirmButtonText: "Aceptar",
            showCancelButton: false,
            cancelButtonText: "Cancelar",
        });
        setOnConfirmCallback(null); // Limpiar onConfirm
        setOnCancelCallback(null); // Limpiar onCancel
    };

    const handleConfirm = () => {
        onConfirmCallback?.(); // Ejecutar onConfirm si está definido
        close(); // Cerrar el diálogo
    };

    const handleCancel = () => {
        onCancelCallback?.(); // Ejecutar onCancel si está definido
        close(); // Cerrar el diálogo
    };

    return {
        fire,
        AlertDialog: () => (
            <AlertDialog
                isOpen={isOpen}
                onClose={close}
                onConfirm={handleConfirm}
                onCancel={handleCancel}
                {...config}
            />
        ),
    };
};