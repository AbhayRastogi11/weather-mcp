from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import StreamingResponse
import asyncio
import json
import random

app = FastAPI()

# CORS - frontend se call allow
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # chaaho to yaha specific origin daal sakte ho
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# --- Hard-coded dummy data generators ---

def build_table_data():
    cities = ["DEL", "BOM", "BLR", "HYD", "CCU", "MAA"]
    statuses = ["On Time", "Delayed", "Cancelled"]
    rows = []

    for i in range(40):
        src = random.choice(cities)
        dst_choices = [c for c in cities if c != src]
        dst = random.choice(dst_choices)
        row = {
            "Flight": f"AI{100 + i}",
            "From": src,
            "To": dst,
            "Status": random.choice(statuses),
            "Delay (min)": random.choice([0, 5, 10, 15, 20, 30, 45, 60]),
        }
        rows.append(row)

    columns = ["Flight", "From", "To", "Status", "Delay (min)"]
    return {"columns": columns, "rows": rows}


def build_chart_data():
    # Simple weekly bookings chart
    days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"]
    data = []
    base = 30
    for i, d in enumerate(days):
        data.append({
            "day": d,
            "bookings": base + random.randint(-5, 15),
        })
    meta = {
        "xKey": "day",
        "yKey": "bookings",
        "chartType": "bar",  # ChartPanel will show bar chart
    }
    return {"data": data, **meta}


@app.post("/get_data")
async def get_data(userprompt: str):
    """
    SSE endpoint expected by ChatPage.jsx:

    - Responds as text/event-stream
    - Sends:
      RUN_STARTED
      TEXT_MESSAGE_START
      multiple TEXT_MESSAGE_CONTENT (streamed text)
      RUN_FINISHED (with table + chart data)
    """

    async def event_stream():
        # 1) RUN_STARTED
        yield "data: " + json.dumps({"type": "RUN_STARTED"}) + "\n\n"
        await asyncio.sleep(0.3)

        # 2) TEXT_MESSAGE_START
        yield "data: " + json.dumps({"type": "TEXT_MESSAGE_START"}) + "\n\n"
        await asyncio.sleep(0.3)

        # 3) Streamed text message
        text = (
            "Here is your data 👇\n\n"
            "Below is a sample flight stats table and a bar chart for weekly bookings."
        )

        for ch in text:
            event = {"type": "TEXT_MESSAGE_CONTENT", "delta": ch}
            yield "data: " + json.dumps(event) + "\n\n"
            await asyncio.sleep(0.02)  # streaming effect

        # 4) TEXT_MESSAGE_END
        yield "data: " + json.dumps({"type": "TEXT_MESSAGE_END"}) + "\n\n"
        await asyncio.sleep(0.2)

        # 5) Attach table + chart in RUN_FINISHED
        table = build_table_data()
        chart = build_chart_data()

        final_event = {
            "type": "RUN_FINISHED",
            "table": table,
            "chart": {
                "data": chart["data"],
                "xKey": chart["xKey"],
                "yKey": chart["yKey"],
                "chartType": chart["chartType"],
            },
        }
        yield "data: " + json.dumps(final_event) + "\n\n"

    return StreamingResponse(event_stream(), media_type="text/event-stream")
