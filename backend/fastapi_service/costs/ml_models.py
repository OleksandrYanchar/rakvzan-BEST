import os
from datetime import date
import numpy as np
import pandas as pd
from sklearn.multioutput import MultiOutputRegressor
from sklearn.ensemble import GradientBoostingRegressor
import joblib
from .models import EstabData


def train_model() -> None:
    """
    Тренування моделі з CSV-файлу:
    CSV має містити колонки:
    employees, avg_monthly_income, annual_tax,
    premises_area, downtime_months, direct_loss, indirect_loss
    """
    current_dir = os.path.dirname(os.path.abspath(__file__))
    csv_path = os.path.join(current_dir, "..", "training_data.csv")
    save_path = os.path.join(current_dir, "..", "loss_estimator.pkl")
    if not os.path.isfile(csv_path):
        raise FileNotFoundError(f"Training CSV not found: {csv_path}")

    df = pd.read_csv(csv_path)
    expected = {
        'employees', 'avg_monthly_income', 'annual_tax',
        'premises_area', 'downtime_months',
        'direct_loss', 'indirect_loss'
    }
    missing = expected - set(df.columns)
    if missing:
        raise ValueError(f"Missing columns in CSV: {missing}")

    X = df[[
        'employees', 'avg_monthly_income', 'annual_tax',
        'premises_area', 'downtime_months'
    ]]
    y = df[['direct_loss', 'indirect_loss']]

    model = MultiOutputRegressor(
        GradientBoostingRegressor(n_estimators=100, random_state=42)
    )
    model.fit(X, y)
    joblib.dump(model, save_path)
    print(f"Model trained and saved to {save_path}")

_model = None

def load_model(path: str = None):
    global _model
    if _model is None:
        if path is None:
            current_dir = os.path.dirname(os.path.abspath(__file__))
            path = os.path.join(current_dir, "..", "loss_estimator.pkl")
        if not os.path.isfile(path):
            raise FileNotFoundError(f"Model file not found: {path}")
        _model = joblib.load(path)
    return _model

def predict_losses(estab: EstabData) -> tuple[float, float]:
    """Прогноз прямих та непрямих збитків"""
    model = load_model()
    today = date.today()
    if estab.destruction_date is None:
        downtime_months = 0
    else:
        downtime_months = max(
            0,
            (today.year - estab.destruction_date.year) * 12 +
            (today.month - estab.destruction_date.month)
        )
    # Build the features array, using 0 if a field is None
    features = np.array([[
        estab.employees if estab.employees is not None else 0,
        estab.avg_monthly_income if estab.avg_monthly_income is not None else 0,
        estab.annual_tax if estab.annual_tax is not None else 0,
        estab.premises_area if estab.premises_area is not None else 0,
        downtime_months,
    ]], dtype=float)
    # Replace any NaN values with 0
    features = np.nan_to_num(features, nan=0.0)
    direct, indirect = model.predict(features)[0]
    return direct, indirect