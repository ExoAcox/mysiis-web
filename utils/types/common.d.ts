interface Data<Value> {
    data: Value;
    status: DataStatus;
    error?: DataError | null;
}
type SetData<Value> = (data: Data<Value>) => void;

type FetchError = {
    message?: string;
    code?: number;
} | null;

type DataError = FetchError;

type DataStatus = "idle" | "pending" | "resolve" | "reject";

interface Store<Value> extends Data<Value> {
    set: (data: Data<Value>) => void;
    reset: () => void;
}
