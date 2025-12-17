export function minDateValidator(date: Date) {
    const enteredDate = new Date(date);
    const today = new Date();
    today.toISOString().split('T')[0];
    console.log("Validating date:", enteredDate, "against min date:", today);
    return enteredDate >= today ? null : { minDate: true };

    
}